const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv/config");
const morgan = require("morgan");
const Product = require("./models/product");
const api = process.env.API_URL;
const mongoose = require("mongoose");

// Middlewares
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "Product one",
    image: "Fake url",
  };
  res.send(product);
});

app.post(`${api}/products`, (req, res) => {
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

// Connect to db
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("DB is connectedd"))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("Server is runnin on port 3000");
});
