const { Schema, model } = require("mongoose");

const ordersScheme = Schema({
    name: String,
    image: String,
    countInStock: {
        type: String,
        required: true,
    },
});

ordersScheme.virtual('id').get(function () {
    return this._id.toHexString();
})

ordersScheme.set('toJSON', {
    virtuals: true
})

module.Orders = model("Orders", ordersScheme);
