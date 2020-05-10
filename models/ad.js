const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    raw: {
        type: mongoose.SchemaTypes.Mixed,
        required: true
    },
    source: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    strict: false
});

const model = mongoose.model('Ad', schema);

module.exports = model;