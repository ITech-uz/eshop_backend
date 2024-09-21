const { Schema, model } = require("mongoose");

const orderItemScheme = Schema({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  }
})

orderItemScheme.virtual('id').get(function () {
  return this._id.toHexString();
})

orderItemScheme.set('toJSON', {
  virtuals: true
})

module.exports = model("OrderItem", orderItemScheme)