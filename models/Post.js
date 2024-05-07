const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    pid: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    creationDate: {
        type: String,
    },
    pageNumber: Number

});

module.exports = mongoose.model('Post', postSchema);