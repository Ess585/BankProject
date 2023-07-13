'use strict'

const { Router } = require('express');
const { check } = require('express-validator');
const { validateParams } = require('../middlewares/validate-params');
const { validateJWT,
        validateAdmin } = require('../middlewares/validate-jwt');

const api = Router();

const { readUserFav, 
        deleteUserFav, 
        addUserFav } = require('../controllers/favorite.controller');

api.post('/add-fav/:id', addUserFav)
api.delete('/delete-fav/:id', deleteUserFav)
api.get('/list-favs', readUserFav)

module.exports = api;
