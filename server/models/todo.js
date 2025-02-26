const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, "Task Is Required"]
    },
    status: {
        type: Boolean,
        default: false,
        required: [true, "Status Is Required"]
    },
    image: {
        type: String,
        default: null,
        required: false
    }
})

module.exports = mongoose.model("Todo", TodoSchema)