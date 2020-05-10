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
    price_ron: {
        type: Number
    },
    price_eur: {
        type: Number
    },
    area: {
        type: Number
    },
    rooms: {
        type: Number,
        required: true
    },
    layout: {
        type: String
    },
    floor: {
        type: String
    },
    year: {
        type: Number
    },
    photos: {
        type: Number
    },
    published_at: {
        type: Date
    },
    modified_at: {
        type: Date
    },
    raw: {
        type: mongoose.SchemaTypes.Mixed,
        //required: true
    },
    source: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    strict: false
});

const model = mongoose.model('Property', schema);

module.exports = model;