'use strict'

const { Router } = require('express');
const { check } = require('express-validator');
const { validateParams } = require('../middlewares/validate-params');
const { validateJWT,
        validateAdmin } = require('../middlewares/validate-jwt');
const { makeTransfer } = require('../controllers/transferencia.controller');

const api = Router();

api.post('/create-tranferencia/:id', [
        check('numberAccount', 'El número de cuenta es obligatorio').not().isEmpty(),
        check('typeAccount', 'Tipo de cuenta es obligatorio').not().isEmpty(),
        validateParams, validateJWT, validateAdmin
    ], makeTransfer
);

module.exports = api;