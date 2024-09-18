const { Schema, model } = require("mongoose");

const useScheme = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  street: {
    type: String,
    default: ''
  },
  apartment: {
    type: String,
    default: ''
  },
  zip: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  }
})

useScheme.virtual('id').get(function () {
  return this._id.toHexString();
})

useScheme.set('toJSON', {
  virtuals: true
})


module.exports = model("User", useScheme);

exports.useScheme = useScheme