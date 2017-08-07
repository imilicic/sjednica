"use strict";
// app.module.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var app_component_1 = require("./app.component");
var error_404_component_1 = require("./errors/error-404.component");
var login_component_1 = require("./login/login.component");
var meetings_component_1 = require("./meetings/meetings.component");
var navbar_component_1 = require("./navbar/navbar.component");
var login_route_activator_service_1 = require("./shared/login-route-activator.service");
var login_service_1 = require("./shared/providers/login.service");
var users_component_1 = require("./users/users.component");
var app_routes_1 = require("./app-routes");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            forms_1.ReactiveFormsModule,
            router_1.RouterModule.forRoot(app_routes_1.appRoutes)
        ],
        declarations: [
            app_component_1.AppComponent,
            error_404_component_1.Error404Component,
            login_component_1.LoginComponent,
            meetings_component_1.MeetingsComponent,
            navbar_component_1.NavbarComponent,
            users_component_1.UsersComponent
        ],
        bootstrap: [app_component_1.AppComponent],
        providers: [
            login_route_activator_service_1.LoginRouteActivatorService,
            login_service_1.LoginService
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map