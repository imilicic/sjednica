var config = require("../config");
var connection = require("../connection");
var express = require('express');
var jsonWebToken = require("jsonwebtoken");
var passwordHash = require("../passwordHash");

var meetingRouter = express.Router();

meetingRouter.use(function(request, response, next) {
    var token = getToken(request);

    if (token) {
        jsonWebToken.verify(token, config.secret, function(error, decoded) {
            if (error) {
                return response.status(401).send("Prijava nije valjana!");
            } else {
                request.decoded = decoded;
                next();
            }
        });
    } else {
        return response.status(401).send("Niste prijavljeni!");
    }
});

meetingRouter.get("/", readMeetings);
meetingRouter.get("/:meetingId", readMeeting);

module.exports = meetingRouter;

function readMeetings(request, response) {
    var queryString = "SELECT MeetingId, Address, City, DateTime, Number, NumberInYear, Name AS Type FROM Meetings INNER JOIN Types USING (TypeId)";
    connection.query(queryString, function(error, meetings) {
        if (error) {
            throw error;
        }
        
        response.status(201).send({
            meetings: meetings
        })
    });
}

function readMeeting(request, response) {
    var meetingId = request.params.meetingId;
    var queryString = "SELECT MeetingId, Address, City, DateTime, Number, NumberInYear, Name AS Type  FROM Meetings INNER JOIN Types USING (TypeId) WHERE MeetingId = ?";
    connection.query(queryString, [meetingId], function(error, meeting) {
        if (error) {
            throw error;
        }
        
        if (meeting.length > 0) {
            var queryString = "SELECT Number, Text FROM AgendaItems WHERE MeetingId = ?";
            connection.query(queryString, [meetingId], function(error, agendaItems) {
                if (error) {
                    throw error;
                }

                if (agendaItems.length > 0) {
                    meeting = meeting[0];
                    meeting.AgendaItems = agendaItems;

                    response.status(201).send(meeting);
                } else {
                    response.status(422).send("Dnevni red ove sjednice ne postoji!");
                }
            });
        } else {
            response.status(422).send("Sjednica ne postoji!");
        }
    });
}

/**
 * returns jwt token from HTTP request
 * @function
 * @param {HTTP Request Object} request - HTTP Request
 */
var getToken = function (request) {
    if (request.headers.authorization) {
        var parts = request.headers.authorization.split(" ");

        if (parts.length == 2) {
            if (parts[0] == "Bearer") {
                return parts[1];
            }
        }
    }

    return false;
}