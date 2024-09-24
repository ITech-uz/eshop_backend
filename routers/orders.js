const express = require("express");
const Order = require("../models/order");
const OrderItem = require("../models/order-item");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", async (req, res) => {
  const orders = await Order.find().populate("user", 'name').sort({'dateOrdered': -1});
  if (!orders) {
    res.status(500).json({status: false, message: "Orders not found!"});
    return;
  }
  res.status(200).json({success: true, orders});
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", 'name')
    .populate({path: "orderItems", populate: {path: "product", populate: "category"}});
  if (!order) {
    res.status(500).json({status: false, message: "Order not found!"});
    return;
  }
  res.status(200).json({success: true, order});
});

router.put("/:id", async (req, res) => {
  Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status
    },
    {new: true}
  )
    .then(updatedOrder => {
      if (updatedOrder) {
        return res.status(200).json({success: true, order: updatedOrder})
      }
    })
    .catch(err => {
      return res.status(400).json({success: false, message: err})
    })
})

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOneAndDelete({_id: id});

    if (!order) {
      return res.status(404).json({success: false, message: "Order not found"});
    }

    await Promise.all(
      order.orderItems.map(async (itemsId) => {
        await OrderItem.findOneAndDelete({_id: itemsId});
      })
    );

    return res.status(200).json({success: true, message: "The order deleted successfully!"});

  } catch (error) {
    return res.status(400).json({success: false, message: error?.message, error});
  }
});

router.post("/", async (req, res) => {
  try {
    const orderIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let order = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        order = await order.save();
        return order._id;
      })
    );

    const totalPrices = await Promise.all(orderIds.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
      return orderItem.product.price * orderItem.quantity
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0).toFixed(2)

    let storedOrder = new Order({
      orderItems: orderIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    storedOrder = await storedOrder.save();

    if (!storedOrder) {
      return res.status(400).json({success: false, message: "The Order could not be created"});
    }

    return res.status(200).json({success: true, order: storedOrder});
  } catch (error) {
    return res.status(500).json({success: false, message: error?.message, error});
  }
});

// Get total sales
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([{
    $group: {_id: null, totalsales: {$sum: '$totalPrice'}}
  }])

  res.status(200).json({
    success: true,
    totalSales: totalSales.pop().totalsales
  })
})

// Get all orders count
router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    res.status(500).json({status: false, message: "Order not found"});
    return;
  }
  res.status(200).json({
    success: true,
    count: orderCount
  });
});

// Get specific user's count
router.get("/get/my-orders", async (req, res) => {
  const authorization = req.headers.authorization.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(authorization, process.env.SECRET);
    const userId = decoded.userId;
    if (!userId) {
      // Handle the case where the user is not found
      return res.status(404).json({success: false, message: "User not found"});
    }
    const userOrders = await Order.find({user: userId})
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category"
        }
      })
      .sort({'dateOrdered': -1});
    if (!userOrders) {
      res.status(400).json({status: false, message: "Orders not found"});
      return;
    }
    res.status(200).json({success: true, orders: userOrders});
  } catch (e) {
    return res.status(401).send("Unauthorized");
  }
});


module.exports = router;
