const {Schema, model} = require("mongoose")

const categoryScheme = Schema({
    name: {
        type: String,
        required: true
    },
    color: String,
    icon: String,
    image: String
})

module.Category = model("Category", categoryScheme)