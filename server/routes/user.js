var config = require("../config");
var connection = require("../connection");
var councilMembershipRouter = require("./councilMembership");
var express = require('express');
var jsonWebToken = require("jsonwebtoken");
var passwordHash = require("../passwordHash");
var validator = require("../validator");
var userHelper = require("./user-helper");

var userRouter = express.Router();

userRouter.use(function(request, response, next) {
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

// makes list of objects [{roleId, roleName}]
userRouter.use(function(request, response, next) {
    var queryString = "SELECT * FROM Roles";
    
    connection.query(queryString, function(error, result) {
        if (error) {
            return response.status(500).send(error);
        }

        request.roles = result;
        next();
    });
});

userRouter.post("/", userHelper.isAdmin, userHelper.ifUserExists, createUser);
userRouter.get("/", userHelper.isAdmin, readUsers);
userRouter.get("/:userId", validateRouteParam, userHelper.isAdmin, userHelper.ifUserExists, readUser);
userRouter.put("/:userId", validateRouteParam, userHelper.ifUserExists, updateUser);

userRouter.use("/:userId/councilMemberships", validateRouteParam, userHelper.isAdmin, function(request, response, next) {
    request.userId = request.params.userId;
    next();
}, councilMembershipRouter);

module.exports = userRouter;

function createUser(request, response) {
    if (!(request.body.email && 
        request.body.firstName && 
        request.body.lastName && 
        request.body.password && 
        request.body.roleName)) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    var email = request.body.Email;
    var firstName = request.body.FirstName;
    var lastName = request.body.LastName;
    var password = request.body.Password;
    var phoneNumber = request.body.PhoneNumber;
    var roleId = searchRoleByName(request.roles, request.body.RoleName);

    var createUserValidators = ["email", "firstName", "lastName", "password"];

    if (phoneNumber) {
        createUserValidators.push("phoneNumber");
    }

    var vals = validator.appendValidators(createUserValidators, userHelper.validators).map(val => {
        val.Value = eval(val.Name);
        return val;
    });

    if (!validator.validateFormInput(vals)) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    if (!roleId) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    var passwordData = passwordHash.hashPassword(password);
    var values;

    if (request.body.PhoneNumber) {
        phoneNumber = request.body.PhoneNumber;
        queryString = "INSERT INTO Users (FirstName, LastName, Email, Password, Salt, PhoneNumber, RoleId) VALUES (?, ?, ?, ?, ?, ?, ?)";
        values = [firstName, lastName, email, passwordData.passwordHash, passwordData.salt, phoneNumber, roleId];
    } else {
        queryString = "INSERT INTO Users (FirstName, LastName, Email, Password, Salt, RoleId) VALUES (?, ?, ?, ?, ?, ?)";
        values = [firstName, lastName, email, passwordData.passwordHash, passwordData.salt, roleId];
    }

    connection.query(queryString, values, function(error, result) {
        if (error) {
            return response.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return response.status(500).send("Korisnik nije izrađen.");
        }
        
        queryString = "SELECT UserId, FirstName, LastName, Email, PhoneNumber, Name AS RoleName FROM Users INNER JOIN Roles USING (RoleId) WHERE Email = ?";
        
        connection.query(queryString, [email], function(error, user) {
            if (error) {
                return response.status(500).send(error);
            }

            if (user.length === 0) {
                return response.status(500).send("Korisnik nije izrađen.");
            }

            response.set("Location", "Location: /api/users/" + user[0].UserId);
            return response.status(201).send(user[0]);
        });
    });
}

function readUser(request, response) {
    var user = request.user;
    user.RoleName = searchRoleById(request.roles, user.RoleId);

    delete user.Password;
    delete user.Salt;
    delete user.RoleId;

    return response.status(200).send(user);
}

function readUsers(request, response) {
    var queryString = "SELECT UserId, FirstName, LastName, Email, PhoneNumber, Name AS RoleName FROM Users INNER JOIN Roles USING(RoleId)";
    
    connection.query(queryString, function(error, users) {
        if (error) {
            return response.status(500).send(error);
        }

        return response.status(200).send({
            users: users
        });
    });
}

function updateUser(request, response) {
    var user = request.user;

    if (request.decoded.RoleName === "admin") {
        // admin is changing user data        
        if (!(
            request.body.Email &&
            request.body.FirstName &&
            request.body.LastName &&
            request.body.hasOwnProperty("Password") &&
            request.body.hasOwnProperty("PhoneNumber") &&
            request.body.RoleName &&
            request.body.UserId
        )) {
            return response.status(400).send("Nevaljan zahtjev!");
        }
        
        if (request.body.UserId != user.UserId) {
            return response.status(400).send("Nevaljan zahtjev!");
        }

        var email = request.body.Email;
        var firstName = request.body.FirstName;
        var lastName = request.body.LastName;
        var password = request.body.Password;
        var phoneNumber = request.body.PhoneNumber;
        var roleId = searchRoleByName(request.roles, request.body.RoleName);
        var userId = request.body.UserId;

        var createUserValidators = ["email", "firstName", "lastName", "password"];
        
        if (phoneNumber) {
            createUserValidators.push("phoneNumber");
        }
    
        var vals = appendValidators(createUserValidators).map(val => {
            val.Value = eval(val.Name);
            return val;
        });
    
        if (!validateFormInput(vals)) {
            return response.status(400).send("Nevaljan zahtjev!");
        }

        if (!roleId) {
            return response.status(400).send("Nevaljan zahtjev!");
        }

        var queryString = "UPDATE Users SET "
        var values = [];

        if (user.Email !== email) {
            queryString += "Email = ?,";
            values.push(email);
            user.Email = email;
        }

        if (user.FirstName !== firstName) {
            queryString += "FirstName = ?,";
            values.push(firstName);
            user.FirstName = firstName;
        }
        
        if (user.LastName !== lastName) {
            queryString += "LastName = ?,";
            values.push(lastName);
            user.LastName = lastName;
        }
        
        if (password !== null) {
            queryString += "Password = ?, Salt = ?,";
            var passwordData = passwordHash.hashPassword(password);
            values.push(passwordData.passwordHash, passwordData.salt);
        }

        if (user.PhoneNumber !== phoneNumber) {
            queryString += "PhoneNumber = ?,";
            values.push(phoneNumber);
            user.PhoneNumber = phoneNumber;
        }

        if (user.RoleId !== roleId) {
            queryString += "RoleId = ?,";
            values.push(roleId);
            user.RoleId = roleId;
        }

        if (values.length === 0) {
            return response.status(400).send("Nevaljan zahtjev!");
        }

        queryString = queryString.slice(0, -1);
        queryString += " WHERE UserId = ?"
        values.push(userId);

        connection.query(queryString, values, function(error, result) {
            if (error) {
                return response.status(500).send(error);
            }

            if (result.serverStatus != 2) {
                return response.status(500).send("Korisnički podaci nisu promjenjeni!");
            } else {
                user.RoleName = searchRoleById(request.roles, user.RoleId);

                delete user.Password;
                delete user.Salt;
                delete user.RoleId;

                return response.status(200).send(user);
            }
        });
    } else if (request.decoded.UserId === user.UserId) {
        // user is changing his data
        if (!request.body.NewPassword || !request.body.OldPassword) {
            return response.status(400).send("Nevaljan zahtjev!");
        }

        var newPassword = request.body.NewPassword;
        var oldPassword = request.body.OldPassword;
        var oldPasswordData = passwordHash.hashPassword(oldPassword, user.Salt);

        if (oldPasswordData.passwordHash !== user.Password) {
            return response.status(400).send("Stara lozinka nije točna!");
        }

        var newPasswordData = passwordHash.hashPassword(newPassword);
        var queryString = "UPDATE Users SET Password = ?, Salt = ? WHERE UserId = ?";
        var values = [newPasswordData.passwordHash, newPasswordData.salt, user.UserId];
    
        connection.query(queryString, values, function(error, result) {
            if (error) {
                return response.status(500).send(error);
            }

            if(result.changedRows == 1) {
                return response.status(200).send("Lozinka je promijenjena!");
            } else {
                return response.status(500).send("Lozinka nije promijenjena!");
            }
        });
    } else {
        return response.status(401).send("Nisi admin!");
    }
}

/**
 * returns jwt token from HTTP request
 * @function
 * @param {HTTP Request Object} request - HTTP Request
 */
var getToken = function(request) {
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

function searchRoleById(roles, roleId) {
    var result = roles.filter(role => {
        if (role.RoleId == roleId) {
            return role;
        }
    });

    if (result.length == 0) {
        return false;
    } else {
        return result[0].Name;
    }
}

function searchRoleByName(roles, roleName) {
    var result = roles.filter(role => {
        if (role.Name == roleName) {
            return role;
        }
    });

    if (result.length == 0) {
        return false;
    } else {
        return result[0].RoleId;
    }
}

function validateRouteParam(request, response, next) {
    if (validator.routeParametersValidator(request.params.userId)) {
        return response.status(400).send("Nevaljan zahtjev!");
    } else {
        next();
    }
}