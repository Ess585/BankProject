'use strict'

require('dotenv').config();
const database = process.env.DATABASE;
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const connection = async() => {
    try{
        await mongoose.connect(database);
        console.log("Conectado a la Base de Datos!");
    }catch(error){
        throw new Error(error)
    }
}

module.exports = {
    connection
}