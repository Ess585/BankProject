'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        require: true,
    },
    DPI: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    cellphone: {
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    workName: {
        type: String,
        require: true,
    },
    rol: {
        type: String,
        String: ['CLIENTE', 'ADMINB'],
        require: true
    },
    account: [{
        No: {
            type: Number,
            require: false,
            default: () => Math.floor(Math.random() * 90000000000000000000) + 10000000000000000000
        },
        tipo: {
            type: String,
            require: true
        },
        banco: {
            type: String,
            require: true
        },
        saldo: {
            type: String,
            require: true
        }
    }],
});

module.exports = mongoose.model('User', userSchema);