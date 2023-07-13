'use strict'

const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const cors = require("cors")
const { connection } = require("./src/database/connection");
const { ADMINB } = require("./src/controllers/user.controller");
const user = require('./src/routes/user.routes');
const favorito = require('./src/routes/favorites.routes');
const transaccion = require('./src/routes/tranferencia.routes');

ADMINB();
connection();

app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use(cors());
app.use('/api', user,
                favorito,
                transaccion)

app.listen(port, () => { 
    console.log(`El servidor esta corriendo en el puerto: ${port}`)
})