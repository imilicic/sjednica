"use strict";
// login.component.ts
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
var response_messages_service_1 = require("../shared/providers/response-messages.service");
var user_service_1 = require("../shared/providers/user.service");
var LoginComponent = (function () {
    function LoginComponent(responseMessagesService, router, userService) {
        this.responseMessagesService = responseMessagesService;
        this.router = router;
        this.userService = userService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        if (this.userService.isAuthenticated()) {
            this.router.navigate(["users"]);
        }
        this.email = new forms_1.FormControl("", forms_1.Validators.required);
        this.password = new forms_1.FormControl("", forms_1.Validators.required);
        this.loginForm = new forms_1.FormGroup({
            email: this.email,
            password: this.password
        });
    };
    LoginComponent.prototype.login = function (values) {
        var _this = this;
        this.userService.login(values).subscribe(function (response) {
            _this.responseMessagesService.setResponseMessage({
                location: "login",
                code: response.message
            });
            if (response.success) {
                _this.router.navigate(["users"]);
            }
            else {
                _this.loginForm.reset();
            }
        });
    };
    LoginComponent.prototype.getWarningMessage = function (code) {
        return this.responseMessagesService.getMessage({
            location: "login",
            code: code
        });
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        styleUrls: ["app/login/login.component.css"],
        templateUrl: "app/login/login.component.html"
    }),
    __metadata("design:paramtypes", [response_messages_service_1.ResponseMessagesService,
        router_1.Router,
        user_service_1.UserService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map