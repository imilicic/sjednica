"use strict";
// routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
var login_component_1 = require("./login/login.component");
var login_route_activator_service_1 = require("./shared/login-route-activator.service");
var users_component_1 = require("./users/users.component");
exports.appRoutes = [
    { path: "login", component: login_component_1.LoginComponent },
    { path: "users", component: users_component_1.UsersComponent, canActivate: [login_route_activator_service_1.LoginRouteActivatorService] },
    { path: "", redirectTo: "login", pathMatch: "full" }
];
//# sourceMappingURL=app-routes.js.map