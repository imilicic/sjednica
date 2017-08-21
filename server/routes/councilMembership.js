var config = require("../config");
var connection = require("../connection");
var express = require('express');
var jsonWebToken = require("jsonwebtoken");
var validator = require("../validator");
var councilMembershipHelper = require("./councilMembership-helper");

var councilMembershipRouter = express.Router();

councilMembershipRouter.post("/", createCouncilMembership);
councilMembershipRouter.get("/", readCouncilMemberships);
councilMembershipRouter.get("/:councilMembershipId", validator, ifCouncilMembershipExists, readCouncilMembership);
councilMembershipRouter.put("/:councilMembershipId", validator, ifCouncilMembershipExists, updateCouncilMembership);
councilMembershipRouter.delete("/:councilMembershipId", validator, ifCouncilMembershipExists, deleteCouncilMembership);

module.exports = councilMembershipRouter;

function createCouncilMembership(request, response) {
    if (!(request.body.hasOwnProperty("IsCouncilMember") && request.body.History)) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    var vals = validator.appendValidators(["isCouncilMember"], councilMembershipHelper.validators).map(val => {
        val.Value = eval(val.Name);
        return val;
    });

    if (!validator.validateFormInput(vals)) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    if (!request.body.IsCouncilMember) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    var endDate = request.body.History[0].EndDate;
    var startDate = request.body.History[0].StartDate;
    var userId = request.userId;

    if (isNaN(Date.parse(endDate)) || isNaN(Date.parse(startDate))) {
        return response.status(400).send("Nevaljan datum!");
    }

    var queryString = "INSERT INTO CouncilMemberships (UserId, StartDate, EndDate) VALUES (?, ?, ?)";

    connection.query(queryString, [userId, startDate, endDate], function(error, result) {
        if (error) {
            return response.status(500).send(error);
        }
        
        if (result.serverStatus != 2) {
            return response.status(500).send("Korisnik nije dodan u vijeće!");
        }

        queryString = "SELECT * FROM CouncilMemberships WHERE CouncilMembershipId = ?"

        connection.query(queryString, [result.insertId], function(error, result) {
            if (error) {
                return response.status(500).send(error);
            }

            var newConcilMembership = {
                IsCouncilMember: true,
                History: [{
                    StartDate: result[0].StartDate,
                    EndDate: result[0].EndDate
                }]
            }

            response.set("Location", "Location: /api/users/" + userId + "/councilMemberships/" + result[0].CouncilMembershipId);
            return response.status(201).send(newConcilMembership);
        });
    });
}

function readCouncilMembership(request, response) {
    var councilMembership = request.councilMembership;
    var endDate = councilMembership.EndDate;
    var startDate = councilMembership.StartDate;
    var now = new Date();
    var isCouncilMember = false;

    if (new Date(startDate) <= now && now <= new Date(endDate)) {
        isCouncilMember = true;
    }

    var newConcilMembership = {
        IsCouncilMember: isCouncilMember,
        History: [{
            StartDate: startDate,
            EndDate: endDate
        }]
    }

    return response.status(200).send(newConcilMembership);
}

function readCouncilMemberships(request, response) {
    var userId = request.userId;
    var queryString = "SELECT StartDate, EndDate FROM CouncilMemberships WHERE UserId = ? ORDER BY StartDate DESC";

    connection.query(queryString, [userId], function(error, result) {
        if (error) {
            return response.status(500).send(error);
        }

        if (result.length == 0) {
            return response.status(404).send("Korisnik nije bio član vijeća!");
        }

        var endDate = new Date(result[0].EndDate);
        var isCouncilMember = false;
        var now = new Date();
        var startDate = new Date(result[0].StartDate);

        if (startDate <= now && now <= endDate) {
            isCouncilMember = true;
        }

        var newCouncilMemberships = {
            IsCouncilMember: isCouncilMember,
            History: result
        };

        return response.status(200).send(newCouncilMemberships);
    });
}

function updateCouncilMembership(request, response) {
    var councilMembership = request.councilMembership;

    if (!(request.body.hasOwnProperty("IsCouncilMember") && request.body.History)) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    if (!request.body.IsCouncilMember) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    var endDate = request.body.History[0].EndDate;
    var startDate = request.body.History[0].StartDate;

    if (isNaN(Date.parse(endDate)) || isNaN(Date.parse(startDate))) {
        return response.status(400).send("Nevaljan datum!");
    }

    if (new Date(councilMembership.EndDate) < new Date()) {
        return response.status(403).send("Ne može se mijenjati!");
    }

    var queryString = "UPDATE CouncilMemberships SET StartDate = ?, EndDate = ? WHERE CouncilMembershipId = ?";
    var values = [startDate, endDate, councilMembership.CouncilMembershipId];

    connection.query(queryString, values, function(error, result) {
        if (error) {
            return response.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return response.status(500).send("Članstvo u vijeću nije promijenjeno!");
        } else {
            return response.status(200).send("Članstvo u vijeću promijenjeno!");
        }
    });
}

function deleteCouncilMembership(request, response) {
    var councilMembership = request.councilMembership;

    if (new Date(councilMembership.EndDate) < new Date()) {
        return response.status(403).send("Ne može se brisati!");
    }

    var queryString = "DELETE FROM CouncilMemberships WHERE CouncilMembershipId = ?";
    connection.query(queryString, [councilMembership.CouncilMembershipId], function(error, result) {
        if (error) {
            return response.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return response.status(500).send("Članstvo u vijeću nije obrisano!");
        } else {
            return response.status(200).send("Članstvo u vijeću obrisano!");
        }
    });
}

function ifCouncilMembershipExists(request, response, next) {
    var councilMembershipId = request.params.councilMembershipId;
    var userId = request.userId;
    var queryString = "SELECT * FROM CouncilMemberships WHERE CouncilMembershipId = ? AND UserId = ?";

    connection.query(queryString, [councilMembershipId, userId], function(error, result) {
        if (error) {
            return response.status(500).send(error);
        }

        if (result.length == 0) {
            return response.status(404).send("Članstvo u vijeću ne postoji!");
        } else {
            request.councilMembership = result[0];
            next();
        }
    });
}

function validator(request, response, next) {
    var councilMembershipId = request.params.councilMembershipId;

    if (isNaN(parseInt(councilMembershipId))) {
        return response.status(400).send("Nevaljan zahtjev!");
    } else {
        next();
    }
}