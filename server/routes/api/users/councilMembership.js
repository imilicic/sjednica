var express = require('express');
var validator = require("../../../validator");
var councilMembershipHelper = require("./councilMembership-helper");

var councilMembershipRouter = express.Router();

councilMembershipRouter.post("/", createCouncilMembership);
councilMembershipRouter.get("/", readCouncilMemberships);
councilMembershipRouter.get("/:councilMembershipId", validateRouteParam, ifCouncilMembershipExists, readCouncilMembership);
councilMembershipRouter.put("/:councilMembershipId", validateRouteParam, ifCouncilMembershipExists, updateCouncilMembership);
councilMembershipRouter.delete("/:councilMembershipId", validateRouteParam, ifCouncilMembershipExists, deleteCouncilMembership);

module.exports = councilMembershipRouter;

function createCouncilMembership(req, res) {
    if (!(req.body.hasOwnProperty("IsCouncilMember") && req.body.History)) {
        return res.status(400).send("Nevaljan zahtjev!");
    }

    var isCouncilMember = req.body.IsCouncilMember;

    var vals = validator.appendValidators(["isCouncilMember"], councilMembershipHelper.validators).map(val => {
        val.Value = eval(val.Name);
        return val;
    });

    if (!validator.validateFormInput(vals)) {
        return res.status(400).send("Nevaljan zahtjev!");
    }

    if (!isCouncilMember) {
        return res.status(400).send("Nevaljan zahtjev!");
    }

    var endDate = req.body.History[0].EndDate;
    var startDate = req.body.History[0].StartDate;
    var userId = req.userId;

    if (isNaN(Date.parse(endDate)) || isNaN(Date.parse(startDate))) {
        return res.status(400).send("Nevaljan datum!");
    }

    var queryString = "INSERT INTO CouncilMemberships (UserId, StartDate, EndDate) VALUES (?, ?, ?)";

    req.connection.query(queryString, [userId, startDate, endDate], function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }
        
        if (result.serverStatus != 2) {
            return res.status(500).send("Korisnik nije dodan u vijeće!");
        }

        queryString = "SELECT * FROM CouncilMemberships WHERE CouncilMembershipId = ?"

        req.connection.query(queryString, [result.insertId], function(error, result) {
            if (error) {
                return res.status(500).send(error);
            }

            var newConcilMembership = {
                IsCouncilMember: true,
                History: [{
                    CouncilMembershipId: result[0].CouncilMembershipId,
                    StartDate: result[0].StartDate,
                    EndDate: result[0].EndDate
                }]
            }

            res.set("Location", "Location: /api/users/" + userId + "/councilMemberships/" + result[0].CouncilMembershipId);
            return res.status(201).send(newConcilMembership);
        });
    });
}

function readCouncilMembership(req, res) {
    return res.status(200).send(req.councilMembership);
}

function readCouncilMemberships(req, res) {
    var userId = req.userId;
    var queryString = "SELECT CouncilMembershipId, StartDate, EndDate FROM CouncilMemberships WHERE UserId = ? ORDER BY StartDate DESC";

    req.connection.query(queryString, [userId], function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.length == 0) {
            return res.status(200).send({
                IsCouncilMember: false,
                History: []
            });
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

        return res.status(200).send(newCouncilMemberships);
    });
}

function updateCouncilMembership(req, res) {
    var councilMembership = req.councilMembership;

    if (!(req.body.hasOwnProperty("IsCouncilMember") && req.body.History)) {
        return res.status(400).send("Nevaljan zahtjev!");
    }

    if (!req.body.IsCouncilMember) {
        return res.status(400).send("Nevaljan zahtjev!");
    }

    if (req.body.History[0].CouncilMembershipId != councilMembership.History[0].CouncilMembershipId) {
        return res.status(400).send("Nevaljan zahtjev!");
    }

    var endDate = req.body.History[0].EndDate;
    var startDate = req.body.History[0].StartDate;

    if (isNaN(Date.parse(endDate)) || isNaN(Date.parse(startDate))) {
        return res.status(400).send("Nevaljan datum!");
    }

    if (new Date(councilMembership.History[0].EndDate) < new Date()) {
        return res.status(403).send("Ne može se mijenjati!");
    }

    var queryString = "UPDATE CouncilMemberships SET StartDate = ?, EndDate = ? WHERE CouncilMembershipId = ?";
    var values = [startDate, endDate, councilMembership.History[0].CouncilMembershipId];

    req.connection.query(queryString, values, function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return res.status(500).send("Članstvo u vijeću nije promijenjeno!");
        } else {
            councilMembership.History[0].EndDate = endDate;
            councilMembership.History[0].StartDate = startDate;
            return res.status(200).send(councilMembership);
        }
    });
}

function deleteCouncilMembership(req, res) {
    var councilMembership = req.councilMembership;

    if (new Date(councilMembership.History[0].EndDate) < new Date()) {
        return res.status(403).send("Ne može se brisati!");
    }

    var queryString = "DELETE FROM CouncilMemberships WHERE CouncilMembershipId = ?";
    req.connection.query(queryString, [councilMembership.History[0].CouncilMembershipId], function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return res.status(500).send("Članstvo u vijeću nije obrisano!");
        } else {
            return res.status(200).send("Članstvo u vijeću obrisano!");
        }
    });
}

function ifCouncilMembershipExists(req, res, next) {
    var councilMembershipId = req.params.councilMembershipId;
    var userId = req.userId;
    var queryString = "SELECT CouncilMembershipId, StartDate, EndDate FROM CouncilMemberships WHERE CouncilMembershipId = ? AND UserId = ?";

    req.connection.query(queryString, [councilMembershipId, userId], function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.length == 0) {
            return res.status(404).send("Članstvo u vijeću ne postoji!");
        } else {
            req.councilMembership = {
                IsCouncilMember: false,
                History: result
            };
            var now = new Date();

            if (new Date(result[0].StartDate) <= now && now <= new Date(result[0].EndDate)) {
                req.councilMembership.IsCouncilMember = true;
            }

            next();
        }
    });
}

function validateRouteParam(req, res, next) {
    if (!validator.routeParametersValidator(req.params.councilMembershipId)) {
        return res.status(400).send("Nevaljan zahtjev!");
    } else {
        next();
    }
}