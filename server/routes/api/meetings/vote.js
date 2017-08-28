var express = require('express');

var voteRouting = express.Router();

voteRouting.post('/', createVote);
voteRouting.get('/', readVotes);
voteRouting.get('/:voteId', readVote);
voteRouting.put('/:voteId', updateVote);

module.exports = voteRouting;

function createVote(req, res) {
    return res.status(501);
}

function readVote(req, res) {
    return res.status(501);
}

function readVotes(req, res) {
    return res.status(501);
}

function updateVote(req, res) {
    return res.status(501);
}
