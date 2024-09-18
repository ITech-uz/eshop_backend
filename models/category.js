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

categoryScheme.virtual('id').get(function () {
    return this._id.toHexString();
})

categoryScheme.set('toJSON', {
    virtuals: true
})

module.exports = model("Category", categoryScheme)