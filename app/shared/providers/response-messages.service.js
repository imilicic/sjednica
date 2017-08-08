"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ResponseMessagesService = (function () {
    function ResponseMessagesService() {
        this.responseMessage = "";
        this.generalMessages = {
            "required": "Polje je obavezno!"
        };
        this.responseMessages = {
            "login": {
                "user-not-found": "Korisnik ne postoji!",
                "wrong-password": "Kriva lozinka!",
                "successful": "",
                "required": this.generalMessages.required
            },
            "users/me": {
                "wrong-old-password": "Stara lozinka je kriva!",
                "unsuccessful": "Lozinka nije promijenjena!",
                "successful": "",
                "required": this.generalMessages.required,
                "new-password-minlength": "Barem 8 znakova!",
                "new-password-pattern": "Barem jedno slovo i jedan broj!",
                "new-password2-required": "Polje je obavezno!",
                "new-passwords-not-equal": "Lozinke nisu jednake!",
                "password-changed": "Vaša lozinka je uspješno promijenjena!"
            }
        };
    }
    ResponseMessagesService.prototype.setResponseMessage = function (responseCode) {
        this.responseMessage = this.responseMessages[responseCode.location][responseCode.code];
        return this.responseMessage;
    };
    ResponseMessagesService.prototype.getResponseMessage = function () {
        return this.responseMessage;
    };
    ResponseMessagesService.prototype.getMessage = function (responseCode) {
        return this.responseMessages[responseCode.location][responseCode.code];
    };
    return ResponseMessagesService;
}());
ResponseMessagesService = __decorate([
    core_1.Injectable()
], ResponseMessagesService);
exports.ResponseMessagesService = ResponseMessagesService;
//# sourceMappingURL=response-messages.service.js.map