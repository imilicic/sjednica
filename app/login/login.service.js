"use strict";
// login.service.ts
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
var Rx_1 = require("rxjs/Rx");
var LoginService = (function () {
    function LoginService(http) {
        this.http = http;
    }
    LoginService.prototype.isAuthenticated = function () {
        return this.loggedIn;
    };
    LoginService.prototype.login = function (values) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post("/api/login", values, options)
            .map(function (response) {
            var responseJson = response.json();
            if (responseJson.success) {
                localStorage.setItem("auth_token", responseJson.token);
                _this.loggedIn = true;
            }
            return responseJson;
        })
            .catch(this.handleError);
    };
    LoginService.prototype.logout = function () {
        localStorage.removeItem("auth_token");
        this.loggedIn = false;
    };
    LoginService.prototype.ngOnInit = function () {
        this.loggedIn = !!localStorage.getItem("auth_token");
    };
    LoginService.prototype.handleError = function (error) {
        return Rx_1.Observable.throw(error.statusText);
    };
    return LoginService;
}());
LoginService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map