"use strict";
// routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
var error_404_component_1 = require("./errors/error-404.component");
var login_component_1 = require("./login/login.component");
var meetings_component_1 = require("./meetings/meetings.component");
var login_route_activator_service_1 = require("./shared/login-route-activator.service");
var users_component_1 = require("./users/users.component");
exports.appRoutes = [
    { path: "login", component: login_component_1.LoginComponent },
    { path: "users", component: users_component_1.UsersComponent, canActivate: [login_route_activator_service_1.LoginRouteActivatorService] },
    { path: "meetings", component: meetings_component_1.MeetingsComponent, canActivate: [login_route_activator_service_1.LoginRouteActivatorService] },
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "**", component: error_404_component_1.Error404Component }
];
//# sourceMappingURL=app-routes.js.map