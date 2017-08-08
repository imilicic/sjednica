"use strict";
// routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
var error_404_component_1 = require("./errors/error-404.component");
var login_component_1 = require("./login/login.component");
var meetings_component_1 = require("./meetings/meetings.component");
var user_route_activator_service_1 = require("./shared/user-route-activator.service");
var user_profile_component_1 = require("./users/profile/user-profile.component");
var users_component_1 = require("./users/users.component");
exports.appRoutes = [
    { path: "login", component: login_component_1.LoginComponent },
    { path: "users", component: users_component_1.UsersComponent, canActivate: [user_route_activator_service_1.UserRouteActivatorService] },
    { path: "users/me", component: user_profile_component_1.UserProfileComponent, canActivate: [user_route_activator_service_1.UserRouteActivatorService] },
    { path: "meetings", component: meetings_component_1.MeetingsComponent, canActivate: [user_route_activator_service_1.UserRouteActivatorService] },
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "**", component: error_404_component_1.Error404Component }
];
//# sourceMappingURL=app-routes.js.map