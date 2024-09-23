const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category")
const router = express.Router();
const mongoose = require("mongoose");
const product = require("../models/product");

router.get("/", async (req, res) => {
  const products = await Product.find().populate('category');
  if (!products) {
    res.status(500).json({ status: false });
    return;
  }
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send("Invalid product ID");
  }
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    res.status(500).json({ status: false, message: "Product not found" });
    return;
  }
  res.send(product);
});

router.post("/", async (req, res) => {
  const categoryId = req.body.category;
  // Check if the categoryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).send("Invalid category ID");
  }

  const category = await Category.findById(categoryId);
  console.log("category=", category);

  if (!category) return res.status(400).send("Category is not valid!");
  let product = Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save()

  if (!product) {
    res.status(500).send("The product cannot be saved")
    return;
  }

  res.send(product)

});

router.put("/:id", async (req, res) => {
  const categoryId = req.body.category;
  // Check if the categoryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).send("Invalid category ID");
  }
  const category = await Category.findById(categoryId);

  if (!category) return res.status(500).send("Category not found!")

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid product ID");
  }

  const product = await Product.findByIdAndUpdate(req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true });

  if (!product) {
    res.status(500).send("The product cannot be saved")
    return;
  }

  res.send(product)
})

router.delete("/:id", (req, res) => {
  const id = req.params.id
  Product.findOneAndDelete({ _id: id })
    .then(product => {
      if (product)
        return res.status(200).json({ success: true, message: "Product deleted successfully!" })
    })
    .catch(err => {
      res.status(400).json({ success: false, message: err })
    })
})


router.get("/get/count", async (req, res) => {
  const productsCount = await Product.countDocuments();
  if (!productsCount) {
    res.status(500).json({ status: false, message: "Product not found" });
    return;
  }
  res.send({
    count: productsCount
  });
});


router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const feturedProducts = await Product.find({ isFeatured: true }).limit(+count);
  if (!feturedProducts) {
    res.status(500).json({ status: false, message: "Product not found" });
    return;
  }
  res.send(feturedProducts);
});


module.exports = router;
