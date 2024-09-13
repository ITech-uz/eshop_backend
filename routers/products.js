const express = require("express");
const Product = require("../models/product");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  if (!products) {
    res.status(500).json({ status: false });
  }
  res.send(products);
});

router.post("/", (req, res) => {
  console.log("request come");
  const product = Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((storedProduct) => {
      res.status(201).json(storedProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        status: false,
      });
    });
});

module.exports = router;
