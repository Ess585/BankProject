'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transferenciaSchema = Schema({
    numberAccount: {
        type: Number,
        validate: {
            validator: async function(value) {
                const numeroCuenta = await mongoose.model('').findOne({ numberAccount: value });
                return numeroCuenta !== null;
            },
            message: 'Numero de cuenta no existente.'
        },
        require: true,
    },
    name: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    nickname: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    saldo: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    amount: {
        type: Number,
        require: true,
    },
});

module.exports = mongoose.model('Transferencia', transferenciaSchema)