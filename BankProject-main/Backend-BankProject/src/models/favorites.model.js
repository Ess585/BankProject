'use strict'

const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    alias:{
        type: String,
        required: true,
        unique: true
    }, 
    tipo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    DPI:{
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Favorite', favoriteSchema);