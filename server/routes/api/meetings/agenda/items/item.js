var express = require('express');
var validator = require('../../../../../validator');
var voteRouter = require('./votes/vote');

var itemRouter = express.Router();

itemRouter.post('/', createItem);
itemRouter.get('/', readItems);
itemRouter.get('/:itemId', validateRouteParam, ifItemExists, readItem);
itemRouter.put('/:itemId', validateRouteParam, ifItemExists, updateItem);
itemRouter.use('/:itemId/votes', validateRouteParam, ifItemExists, function(req, res, next) {
    req.itemId = req.params.itemId;
    next();
}, voteRouter);

module.exports = itemRouter;

function createItem(req, res) {
    return res.status(501);
}

function readItems(req, res) {
    return res.status(501);
}

function readItem(req, res) {
    return res.status(200).send(req.item);
}

function updateItem(req, res) {
    return res.status(501);
}

function ifItemExists(req, res, next) {
    var agendaItemId = req.params.itemId;
    var queryString = 'SELECT * FROM AgendaItems WHERE AgendaItemId = ?';

    req.connection.query(queryString, [agendaItemId], function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.length == 0) {
            return res.status(404).send('Točka dnevnog reda ne postoji!');
        } else {
            req.item = result[0];
            next();
        }
    });
}

function validateRouteParam(req, res, next) {
    if (!validator.routeParametersValidator(req.params.itemId)) {
        return res.status(400).send('Nevaljan zahtjev!');
    } else {
        next();
    }
}