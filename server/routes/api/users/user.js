var express = require('express');
var passwordHash = require('../../../passwordHash');
var validator = require('../../../validator');
var userHelper = require('./user-helper');

var councilMembershipRouter = require('./councilMembership');

var userRouter = express.Router();

// makes list of objects [{roleId, roleName}]
userRouter.use(function(req, res, next) {
    var queryString = 'SELECT * FROM Roles';
    
    req.connection.query(queryString, function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        req.roles = result;
        next();
    });
});

userRouter.post('/', isAdmin, ifUserExists, createUser);
userRouter.get('/', isAdmin, readUsers);
userRouter.get('/:userId', validateRouteParam, isAdmin, ifUserExists, readUser);
userRouter.put('/:userId', validateRouteParam, ifUserExists, updateUser);

userRouter.use('/:userId/councilMemberships', validateRouteParam, ifUserExists, isAdmin, function(req, res, next) {
    req.userId = req.params.userId;
    next();
}, councilMembershipRouter);

module.exports = userRouter;

function createUser(req, res) {
    if (!(req.body.Email && 
        req.body.FirstName && 
        req.body.LastName && 
        req.body.Password && 
        req.body.RoleName)) {
        return res.status(400).send('Nevaljan zahtjev!');
    }

    var email = req.body.Email;
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var password = req.body.Password;
    var phoneNumber = req.body.PhoneNumber;
    var roleId = searchRoleByName(req.roles, req.body.RoleName);

    var createUserValidators = ['email', 'firstName', 'lastName', 'password'];

    if (phoneNumber) {
        createUserValidators.push('phoneNumber');
    }

    var vals = validator.appendValidators(createUserValidators, userHelper.validators).map(val => {
        val.Value = eval(val.Name);
        return val;
    });

    if (!validator.validateFormInput(vals)) {
        return res.status(400).send('Nevaljan zahtjev!');
    }

    if (!roleId) {
        return res.status(400).send('Nevaljan zahtjev!');
    }

    var passwordData = passwordHash.hashPassword(password);
    var values;

    if (req.body.PhoneNumber) {
        phoneNumber = req.body.PhoneNumber;
        queryString = 'INSERT INTO Users (FirstName, LastName, Email, Password, Salt, PhoneNumber, RoleId) VALUES (?, ?, ?, ?, ?, ?, ?)';
        values = [firstName, lastName, email, passwordData.passwordHash, passwordData.salt, phoneNumber, roleId];
    } else {
        queryString = 'INSERT INTO Users (FirstName, LastName, Email, Password, Salt, RoleId) VALUES (?, ?, ?, ?, ?, ?)';
        values = [firstName, lastName, email, passwordData.passwordHash, passwordData.salt, roleId];
    }

    req.connection.query(queryString, values, function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        if (result.serverStatus != 2) {
            return res.status(500).send('Korisnik nije izrađen.');
        }
        
        queryString = 'SELECT UserId, FirstName, LastName, Email, PhoneNumber, Name AS RoleName FROM Users INNER JOIN Roles USING (RoleId) WHERE Email = ?';
        
        req.connection.query(queryString, [email], function(error, user) {
            if (error) {
                return res.status(500).send(error);
            }

            if (user.length === 0) {
                return res.status(500).send('Korisnik nije izrađen.');
            }

            res.set('Location', 'Location: /api/users/' + user[0].UserId);
            return res.status(201).send(user[0]);
        });
    });
}

function readUser(req, res) {
    var user = req.user;
    user.RoleName = searchRoleById(req.roles, user.RoleId);

    delete user.Password;
    delete user.Salt;
    delete user.RoleId;

    return res.status(200).send(user);
}

function readUsers(req, res) {
    var queryString = 'SELECT UserId, FirstName, LastName, Email, PhoneNumber, Name AS RoleName FROM Users INNER JOIN Roles USING(RoleId)';
    
    req.connection.query(queryString, function(error, users) {
        if (error) {
            return res.status(500).send(error);
        }

        return res.status(200).send({
            users: users
        });
    });
}

function updateUser(req, res) {
    var user = req.user;

    if (req.decoded.RoleName === 'admin' && req.decoded.UserId !== user.UserId) {
        // admin is changing user data        
        if (!(
            req.body.Email &&
            req.body.FirstName &&
            req.body.LastName &&
            req.body.hasOwnProperty('Password') &&
            req.body.hasOwnProperty('PhoneNumber') &&
            req.body.RoleName &&
            req.body.UserId
        )) {
            return res.status(400).send('Nevaljan zahtjev!');
        }
        
        if (req.body.UserId != user.UserId) {
            return res.status(400).send('Nevaljan zahtjev!');
        }

        var email = req.body.Email;
        var firstName = req.body.FirstName;
        var lastName = req.body.LastName;
        var password = req.body.Password;
        var phoneNumber = req.body.PhoneNumber;
        var roleId = searchRoleByName(req.roles, req.body.RoleName);
        var userId = req.body.UserId;

        var createUserValidators = ['email', 'firstName', 'lastName'];

        if (password) {
            createUserValidators.push('password');
        }
        
        if (phoneNumber) {
            createUserValidators.push('phoneNumber');
        }
    
        var vals = validator.appendValidators(createUserValidators, userHelper.validators).map(val => {
            val.Value = eval(val.Name);
            return val;
        });
    
        if (!validator.validateFormInput(vals)) {
            return res.status(400).send('Nevaljan zahtjev!');
        }

        if (!roleId) {
            return res.status(400).send('Nevaljan zahtjev!');
        }

        var queryString = 'UPDATE Users SET '
        var values = [];

        if (user.Email !== email) {
            queryString += 'Email = ?,';
            values.push(email);
            user.Email = email;
        }

        if (user.FirstName !== firstName) {
            queryString += 'FirstName = ?,';
            values.push(firstName);
            user.FirstName = firstName;
        }
        
        if (user.LastName !== lastName) {
            queryString += 'LastName = ?,';
            values.push(lastName);
            user.LastName = lastName;
        }
        
        if (password !== null) {
            queryString += 'Password = ?, Salt = ?,';
            var passwordData = passwordHash.hashPassword(password);
            values.push(passwordData.passwordHash, passwordData.salt);
        }

        if (user.PhoneNumber !== phoneNumber) {
            queryString += 'PhoneNumber = ?,';
            values.push(phoneNumber);
            user.PhoneNumber = phoneNumber;
        }

        if (user.RoleId !== roleId) {
            queryString += 'RoleId = ?,';
            values.push(roleId);
            user.RoleId = roleId;
        }

        if (values.length === 0) {
            user.RoleName = searchRoleById(req.roles, user.RoleId);
            
            delete user.Password;
            delete user.Salt;
            delete user.RoleId;

            return res.status(200).send(user);
        }

        queryString = queryString.slice(0, -1);
        queryString += ' WHERE UserId = ?'
        values.push(userId);

        req.connection.query(queryString, values, function(error, result) {
            if (error) {
                return res.status(500).send(error);
            }

            if (result.serverStatus != 2) {
                return res.status(500).send('Korisnički podaci nisu promjenjeni!');
            } else {
                user.RoleName = searchRoleById(req.roles, user.RoleId);

                delete user.Password;
                delete user.Salt;
                delete user.RoleId;

                return res.status(200).send(user);
            }
        });
    } else if (req.decoded.UserId === user.UserId) {
        // user is changing his data
        if (!req.body.NewPassword || !req.body.OldPassword || !req.body.UserId) {
            return res.status(400).send('Nevaljan zahtjev!');
        }

        if (req.body.UserId != user.UserId) {
            return res.status(400).send('Nevaljan zahtjev!');
        }

        var newPassword = req.body.NewPassword;
        var oldPassword = req.body.OldPassword;
        var oldPasswordData = passwordHash.hashPassword(oldPassword, user.Salt);

        if (oldPasswordData.passwordHash !== user.Password) {
            return res.status(400).send('Stara lozinka nije točna!');
        }

        var newPasswordData = passwordHash.hashPassword(newPassword);
        var queryString = 'UPDATE Users SET Password = ?, Salt = ? WHERE UserId = ?';
        var values = [newPasswordData.passwordHash, newPasswordData.salt, user.UserId];
    
        req.connection.query(queryString, values, function(error, result) {
            if (error) {
                return res.status(500).send(error);
            }

            if(result.changedRows == 1) {
                return res.status(200).send('Lozinka je promijenjena!');
            } else {
                return res.status(500).send('Lozinka nije promijenjena!');
            }
        });
    } else {
        return res.status(401).send('Nisi admin!');
    }
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

function validateRouteParam(req, res, next) {
    if (!validator.routeParametersValidator(req.params.userId)) {
        return res.status(400).send('Nevaljan zahtjev!');
    } else {
        next();
    }
}

function isAdmin(req, res, next) {
    if (req.decoded.RoleName != 'admin') {
        return res.status(403).send('Nisi admin!');
    } else {
        next();
    }
}

function ifUserExists(req, res, next) {
    var values = [];
    var queryString = '';

    if (req.params.userId) { // GET, PUT /api/users/:userId
        values.push(req.params.userId);
        queryString = 'SELECT * FROM Users WHERE UserId = ?';

        req.connection.query(queryString, values, function(error, result) {
            if (error) {
                return res.status(500).send(error);
            }
    
            if (result.length == 0) {
                return res.status(404).send('Korisnik ne postoji!');
            } else {
                req.user = result[0];
                next();
            }
        });
    } else if (req.body.Email) { // POST /api/users
        values.push(req.body.Email);
        queryString = 'SELECT * FROM Users WHERE Email = ?';

        req.connection.query(queryString, values, function(error, result) {
            if (error) {
                return res.status(500).send(error);
            }
    
            if (result.length > 0) {
                return res.status(409).send('Korisnik već postoji!');
            } else {
                next();
            }
        });
    } else {
        return res.status(400).send('Nevaljan zahtjev');
    }
}