const { Schema, model } = require("mongoose");

const productScheme = Schema({
  name: String,
  image: String,
  countInStock: {
    type: String,
    required: true,
  },
});

module.Product = model("Product", productScheme);
