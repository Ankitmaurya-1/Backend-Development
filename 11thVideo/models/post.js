const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    postdata: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: String,
        default: Date.now()
    }
});

module.exports = mongoose.model("Post", postSchema);