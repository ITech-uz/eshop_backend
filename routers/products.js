const express = require("express")
const {Product} = require("../models/product");
const router = express.Router()


router.get("/", (req, res) => {
    const product = {
        id: 1,
        name: "Product one",
        image: "Fake url",
    };
    res.send(product);
});

router.post("/", (req, res) => {
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

module.exports = router