var express = require('express');
var validator = require('../../../validator');
var votingRouter = express.Router();

votingRouter.post('/', isAdmin, createVoting);
votingRouter.get('/', readVotings);
votingRouter.delete('/:votingId', validateRouteParam, ifVotingExists, isAdmin, deleteVoting);

module.exports = votingRouter;

function createVoting(req, res) {
    if (!req.body.AgendaItemId) {
        return res.status(400).send('Nevaljan zahtjev!');
    }

    var agendaItemId = req.body.AgendaItemId;
    var queryString = 'INSERT INTO Votings (AgendaItemId) VALUES (?)';

    req.connection.query(queryString, [agendaItemId], function(error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return res.status(500).send('Glasanje nije otvoreno!');
        } else {
            queryString = 'SELECT * FROM Votings';

            req.connection.query(queryString, function(error, result) {
                if (error) {
                    console.error(error);
                    return res.status(500).send(error);
                }

                //res.set('Location', 'Location: api/votings/' + id)
                return res.status(201).send(result.map(agendaItem => agendaItem.AgendaItemId));
            });
        }
    });
}

function readVotings(req, res) {
    var queryString = 'SELECT * FROM Votings';
    
    req.connection.query(queryString, function(error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send(error);
        }

        return res.status(200).send(result.map(agendaItem => agendaItem.AgendaItemId));
    });
}

function deleteVoting(req, res) {
    var votingId = req.params.votingId;
    var queryString = 'DELETE FROM Votings Where AgendaItemId = ?';

    req.connection.query(queryString, [votingId], function(error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return res.status(500).send('Glasanje nije zatvoreno!');
        } else {
            return res.status(200).send('Glasanje je zatvoreno!');
        }
    });
}

function isAdmin(req, res, next) {
    if (req.decoded.RoleName != 'admin') {
        return res.status(403).send('Nisi admin!');
    } else {
        next();
    }
}

function ifVotingExists(req, res, next) {
    var meetingId = req.meetingId;
    var votingId = req.params.votingId;
    var queryString = 'SELECT * FROM AgendaItems WHERE MeetingId = ? AND AgendaItemId = ?';

    req.connection.query(queryString, [meetingId, votingId], function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.length == 0) {
            return res.status(404).send('Točka dnevnog reda ove sjednice ne postoji!');
        } else {
            next();
        }
    });
}

function validateRouteParam(req, res, next) {
    if (!validator.routeParametersValidator(req.params.votingId)) {
        return res.status(400).send('Nevaljan zahtjev!');
    } else {
        next();
    }
}