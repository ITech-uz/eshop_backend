const {Schema, model} = require("mongoose")

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

module.OrderItems = model("OrderItems", orderItemsScheme)