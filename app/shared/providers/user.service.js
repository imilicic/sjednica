"use strict";
// user.service.ts
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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
var UserService = (function () {
    function UserService(http) {
        var _this = this;
        this.http = http;
        var authToken = localStorage.getItem("auth_token");
        this.loggedIn = !!authToken;
        if (this.loggedIn && this.user == undefined) {
            var headers = new http_1.Headers({
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authToken
            });
            var options = new http_1.RequestOptions({ headers: headers });
            this.http.get("/api/get/users/current", options)
                .map(function (response) {
                _this.user = response.json();
            }).subscribe();
        }
    }
    UserService.prototype.changePassword = function (formValues) {
        var headers = new http_1.Headers({
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("auth_token")
        });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put("/api/put/users/password", formValues, options)
            .map(function (response) {
            var responseJson = response.json();
            if (responseJson.success) {
                localStorage.setItem("auth_token", responseJson.token);
            }
            return responseJson;
        })
            .catch(this.handleError);
    };
    UserService.prototype.isAuthenticated = function () {
        return this.loggedIn;
    };
    UserService.prototype.login = function (values) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post("/api/login", values, options)
            .map(function (response) {
            var responseJson = response.json();
            if (responseJson.success) {
                localStorage.setItem("auth_token", responseJson.token);
                _this.loggedIn = true;
                _this.user = responseJson.user;
            }
            return responseJson;
        })
            .catch(this.handleError);
    };
    UserService.prototype.logout = function () {
        localStorage.removeItem("auth_token");
        this.loggedIn = false;
        this.user = undefined;
    };
    UserService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.statusText);
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map