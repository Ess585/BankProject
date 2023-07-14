'use strict'

const { Router } = require('express');
const { check } = require('express-validator');
const { validateParams } = require('../middlewares/validate-params');
const { validateJWT, validateAdmin } = require('../middlewares/validate-jwt');
const { createUser,
        readUser, 
        updateUser, 
        deleteUser, 
        loginUser, 
        addAccount,
        deleteAccount,
        listAccounts} = require('../controllers/user.controller');

const api = Router();

//Rutas para usuarios:
api.post('/create-user', [
        check('name', 'El name es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser igual o mayor a 6 digitos').isLength({min: 6}),
         validateJWT
    ], createUser
);
api.get('/read-user', readUser);
api.put('/update-user/:id', [
        validateJWT,
        check('name', 'El name es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        validateParams
    ], updateUser
);

api.delete('/delete-user/:id', validateJWT, deleteUser);

//Ruta para logearse
api.post('/login', loginUser)

//Rutas para Cuentas
api.put('/add-cuenta/:id', addAccount)
api.delete('/delete-cuenta/:id', deleteAccount)
api.get('/list-cuentas', listAccounts)

module.exports = api;