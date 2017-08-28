var express = require('express');

var voteRouter = express.Router();

voteRouter.post('/', createVote);
voteRouter.get('/', readVotes);
voteRouter.get('/:voteId', readVote);
voteRouter.put('/:voteId', updateVote);

module.exports = voteRouter;

function createVote(req, res) {
    if (!req.body.UserId || !req.body.hasOwnProperty('Vote')) {
        return res.status(400).send('Nevaljan zahtjev!');
    }

    var userId = req.body.UserId;
    var vote = req.body.Vote;

    var queryString = 'INSERT INTO Votes (AgendaItemId, UserId, Vote) VALUES (?, ?, ?)';
    var values = [req.itemId, userId, vote];

    req.connection.query(queryString, values, function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return res.status(500).send('Glasanje nije spremljeno!');
        } else {
            var newVote = {
                UserId: userId,
                Vote: vote,
                VoteId: result.insertId
            };

            res.set('Location', 'Location: /api/meetings/' + req.meetingId + '/agenda/items/' + req.itemId + '/votes/' + result.insertId);
            return res.status(201).send(newVote);
        }
    });
}

function readVotes(req, res) {
    return res.status(501);
}

function readVote(req, res) {
    return res.status(501);
}

function updateVote(req, res) {
    if (!req.body.UserId || !req.body.hasOwnProperty('Vote')) {
        return res.status(400).send('Nevaljan zahtjev!');
    }

    var userId = req.body.UserId;
    var vote = req.body.Vote;
    var voteId = req.params.voteId;

    var queryString = 'UPDATE Votes SET Vote = ? WHERE VoteId = ?';
    var values = [vote, voteId];

    req.connection.query(queryString, values, function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return res.status(500).send('Glasanje nije spremljeno!');
        } else {
            var newVote = {
                UserId: userId,
                Vote: vote,
                VoteId: voteId
            };

            return res.status(200).send(newVote);
        }
    });
}