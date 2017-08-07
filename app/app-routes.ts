// routes.ts

import { Error404Component } from "./errors/error-404.component";
import { LoginComponent } from "./login/login.component";
import { MeetingsComponent } from "./meetings/meetings.component";
import { LoginRouteActivatorService } from "./shared/login-route-activator.service";
import { UsersComponent } from "./users/users.component";

import { Routes } from "@angular/router"

export const appRoutes : Routes = [
    { path: "login", component: LoginComponent },
    { path: "users", component: UsersComponent, canActivate: [LoginRouteActivatorService] },
    { path: "meetings", component: MeetingsComponent, canActivate: [LoginRouteActivatorService] },
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "**", component: Error404Component }
]