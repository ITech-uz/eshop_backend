const { Schema, model } = require("mongoose")

const orderScheme = Schema({
  orderItems: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderItem',
    required: true
  }],
  shippingAddress1: {
    type: String,
    required: true
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "Pending "
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  dateOrder: {
    type: Date,
    default: Date.now()
  }
})

orderScheme.virtual('id').get(function () {
  return this._id.toHexString();
})

orderScheme.set('toJSON', {
  virtuals: true
})

module.exports = model("Order", orderScheme)