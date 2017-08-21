var validators = [
    {
        Name: "email",
        Max: 40,
        Min: 5,
        Type: "char",
        RegExp: "^[A-Za-z][A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$"
    },
    {
        Name: "firstName",
        Max: 40,
        Min: 2,
        Type: "char"
    },
    {
        Name: "lastName",
        Max: 40,
        Min: 2,
        Type: "char"
    },
    {
        Name: "password",
        Max: 40,
        Min: 8,
        Type: "char",
        RegExp: "^(?=[a-zA-Z0-9]{8,})(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).*"
    },
    {
        Name: "phoneNumber",
        Max: 40,
        Min: 10,
        Type: "char",
        RegExp: "^[0-9]{3} [0-9]{6,10}$"
    }
];

function isAdmin(request, response, next) {
    if (request.decoded.RoleName != "admin") {
        return response.status(403).send("Nisi admin!");
    } else {
        next();
    }
}

function ifUserExists(request, response, next) {
    var values = [];
    var queryString = "";

    if (request.params.userId) { // GET, PUT /api/users/:userId
        values.push(request.params.userId);
        queryString = "SELECT * FROM Users WHERE UserId = ?";

        connection.query(queryString, values, function(error, result) {
            if (error) {
                return response.status(500).send(error);
            }
    
            if (result.length == 0) {
                return response.status(404).send("Korisnik ne postoji!");
            } else {
                request.user = result[0];
                next();
            }
        });
    } else if (request.body.Email) { // POST /api/users
        values.push(request.body.Email);
        queryString = "SELECT * FROM Users WHERE Email = ?";

        connection.query(queryString, values, function(error, result) {
            if (error) {
                return response.status(500).send(error);
            }
    
            if (result.length > 0) {
                return response.status(409).send("Korisnik već postoji!");
            } else {
                next();
            }
        });
    } else {
        return response.status(400).send("Nevaljan zahtjev");
    }
}

module.exports.validators = validators;
module.exports.ifUserExists = ifUserExists;
module.exports.isAdmin = isAdmin;