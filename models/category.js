const { Schema, model } = require("mongoose")

const categoryScheme = Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    icon: {
        type: String
    },
})

module.exports = model("Category", categoryScheme)