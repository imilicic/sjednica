"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var response_messages_service_1 = require("../../shared/providers/response-messages.service");
var toastr_service_1 = require("../../shared/providers/toastr.service");
var user_service_1 = require("../../shared/providers/user.service");
var UserProfileComponent = (function () {
    function UserProfileComponent(responseMessagesService, router, toastrService, userService) {
        this.responseMessagesService = responseMessagesService;
        this.router = router;
        this.toastrService = toastrService;
        this.userService = userService;
        this.changePasswordMode = false;
        this.generatedPassword = false;
    }
    UserProfileComponent.prototype.changePassword = function (formValues) {
        var _this = this;
        this.userService.changePassword({
            personId: this.userService.user.PersonId,
            newPassword: formValues.newPassword,
            oldPassword: formValues.oldPassword
        }).subscribe(function (response) {
            if (response.success) {
                _this.toastrService.success(_this.responseMessagesService.getMessage({
                    location: "users/me",
                    code: "password-changed"
                }));
                _this.changePasswordMode = false;
                _this.passwordForm.reset();
            }
            else {
                _this.toastrService.error(_this.responseMessagesService.setResponseMessage({
                    location: "users/me",
                    code: response.message
                }));
            }
        });
    };
    UserProfileComponent.prototype.ngOnInit = function () {
        this.newPassword = new forms_1.FormControl("", [forms_1.Validators.required, forms_1.Validators.minLength(8), forms_1.Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]*)$/)]);
        this.newPassword2 = new forms_1.FormControl("", forms_1.Validators.required);
        this.oldPassword = new forms_1.FormControl("", forms_1.Validators.required);
        this.passwordForm = new forms_1.FormGroup({
            newPassword: this.newPassword,
            newPassword2: this.newPassword2,
            oldPassword: this.oldPassword
        });
        this.passwordForm.setValidators([areNewPasswordsEqual()]);
    };
    UserProfileComponent.prototype.setPassword = function () {
        this.generatedPassword = !this.generatedPassword;
        if (this.generatedPassword) {
            var password = this.generatePassword(8, 4, 2);
            this.newPassword.setValue(password);
            this.newPassword2.setValue(password);
            this.newPassword.markAsTouched();
            this.newPassword2.markAsTouched();
        }
        else {
            this.newPassword.reset();
            this.newPassword2.reset();
        }
    };
    UserProfileComponent.prototype.getWarningMessage = function (code) {
        return this.responseMessagesService.getMessage({
            location: "users/me",
            code: code
        });
    };
    /**
     * generates a password of given length
     * @function
     * @param length length of password
     * @param minLetters minimum number of letters in password (case insensitive)
     * @param minNumbers minimum number of numbers in password
     */
    UserProfileComponent.prototype.generatePassword = function (length, minLetters, minNumbers) {
        var letters = "abcdefghijklmnpqrstuvwxyz";
        var numbers = "123456789";
        var characters;
        var password = [];
        var chosen = "";
        // fill password with letters
        for (var i = 0; i < minLetters; i++) {
            chosen = letters[Math.floor(Math.random() * (letters.length - 1))];
            letters = letters.split(chosen).join(""); // deletes chosen letter
            if ((Math.random() < 0.5 || chosen == "i" || chosen == "o") && chosen != "l") {
                password.push(chosen);
            }
            else {
                password.push(chosen.toLocaleUpperCase());
            }
        }
        // fill password with numbers
        for (var i = 0; i < minNumbers; i++) {
            chosen = numbers[Math.floor(Math.random() * (numbers.length - 1))];
            numbers = numbers.split(chosen).join(""); // deletes chosen number
            password.push(chosen);
        }
        // fill the rest of password with any characters
        characters = letters + numbers;
        for (var i = password.length; i < length; i++) {
            chosen = characters[Math.floor(Math.random() * (characters.length - 1))];
            characters = characters.split(chosen).join(""); // deletes chosen number
            if ((Math.random() < 0.5 || chosen == "i" || chosen == "o") && chosen != "l") {
                password.push(chosen);
            }
            else {
                password.push(chosen.toLocaleUpperCase());
            }
        }
        return this.shuffleArray(password).join("");
    };
    /**
     * returns a random permutation of a given array
     * @function
     * @param array array of things to be shuffled
     */
    UserProfileComponent.prototype.shuffleArray = function (array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };
    return UserProfileComponent;
}());
UserProfileComponent = __decorate([
    core_1.Component({
        styleUrls: ["app/users/profile/user-profile.component.css"],
        templateUrl: "app/users/profile/user-profile.component.html"
    }),
    __metadata("design:paramtypes", [response_messages_service_1.ResponseMessagesService,
        router_1.Router,
        toastr_service_1.ToastrService,
        user_service_1.UserService])
], UserProfileComponent);
exports.UserProfileComponent = UserProfileComponent;
function areNewPasswordsEqual() {
    return function (formGroup) {
        var newPassword = formGroup.controls["newPassword"].value;
        var newPassword2 = formGroup.controls["newPassword2"].value;
        if (newPassword != newPassword2) {
            return {
                newPasswordsAreNotEqual: true
            };
        }
        return null;
    };
}
//# sourceMappingURL=user-profile.component.js.map