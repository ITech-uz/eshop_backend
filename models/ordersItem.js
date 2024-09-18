const { Schema, model } = require("mongoose")

const orderItemsScheme = Schema({
    product: {
        type: Object,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }

})

orderItemsScheme.virtual('id').get(function () {
    return this._id.toHexString();
})

orderItemsScheme.set('toJSON', {
    virtuals: true
})

module.OrderItems = model("OrderItems", orderItemsScheme)