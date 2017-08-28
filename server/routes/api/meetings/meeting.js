var express = require('express');
var validator = require('../../../validator');

var agendaRouter = require('./agenda/agenda');
var votingRouter = require('./voting');
var meetingRouter = express.Router();

meetingRouter.use('/:meetingId/agenda', validateRouteParam, ifMeetingExists, function(req, res, next) {
    req.meetingId = req.params.meetingId;
    next();
}, agendaRouter);
meetingRouter.use('/:meetingId/votings', validateRouteParam, ifMeetingExists, function(req, res, next) {
    req.meetingId = req.params.meetingId;
    next();
}, votingRouter);

meetingRouter.post('/', createMeeting);
meetingRouter.get('/', readMeetings);
meetingRouter.get('/:meetingId', validateRouteParam, ifMeetingExists, readMeeting);
meetingRouter.put('/:meetingId', validateRouteParam, ifMeetingExists, updateMeeting);

module.exports = meetingRouter;

function createMeeting(req, res) {
    return res.status(501);
}

function readMeetings(req, res) {
    var queryString = 'SELECT MeetingId, Address, City, DateTime, Number, NumberInYear, Name AS Type FROM Meetings INNER JOIN Types USING (TypeId)';

    req.connection.query(queryString, function(error, meetings) {
        if (error) {
            return res.status(500).send(error);
        }
        
        return res.status(200).send({
            meetings: meetings
        })
    });
}

function readMeeting(req, res) {
    var meeting = req.meeting;
    var queryString = 'SELECT AgendaItemId, Number, Text FROM AgendaItems WHERE MeetingId = ?';
    
    req.connection.query(queryString, [meeting.MeetingId], function(error, agendaItems) {
        if (error) {
            return res.status(500).send(error);
        }

        if (agendaItems.length > 0) {
            meeting.AgendaItems = agendaItems;

            return res.status(200).send(meeting);
        } else {
            return res.status(404).send('Dnevni red ove sjednice ne postoji!');
        }
    });
}

function updateMeeting(req, res) {
    return res.status(501);
}

function ifMeetingExists(req, res, next) {
    var meetingId = req.params.meetingId;
    var queryString = 'SELECT MeetingId, Address, City, DateTime, Number, NumberInYear, Name AS Type FROM Meetings INNER JOIN Types USING (TypeId) WHERE MeetingId = ?';

    req.connection.query(queryString, [meetingId], function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.length == 0) {
            return res.status(404).send('Sjednica ne postoji!');
        } else {
            req.meeting = result[0];
            next();
        }
    });
}

function validateRouteParam(req, res, next) {
    if (!validator.routeParametersValidator(req.params.meetingId)) {
        return res.status(400).send('Nevaljan zahtjev!');
    } else {
        next();
    }
}