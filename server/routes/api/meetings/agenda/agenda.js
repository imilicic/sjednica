var express = require('express');
var itemRouter = require('./items/item');

var agendaRouter = express.Router();

agendaRouter.post('/', createAgenda);
agendaRouter.get('/', readAgenda);
agendaRouter.put('/', updateAgenda);
agendaRouter.use('/items', itemRouter);
agendaRouter.get('/votes', readAgendaVotes);
agendaRouter.get('/votes/:userId', readAgendaUserVotes);

module.exports = agendaRouter;

function createAgenda(req, res) {
    return res.status(501);
}

function readAgenda(req, res) {
    return res.status(501);
}

function updateAgenda(req, res) {
    return res.status(501);
}

function readAgendaVotes(req, res) {
    return res.status(501);
}

function readAgendaUserVotes(req, res) {
    var meetingId = req.meetingId;
    var userId = req.params.userId;
    var queryString = "SELECT AgendaItemId, VoteId, Vote FROM Votes INNER JOIN AgendaItems USING (AgendaItemId) WHERE UserId = ? AND MeetingId = ?";

    req.connection.query(queryString, [userId, meetingId], function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        return res.status(200).send(result);
    });
}