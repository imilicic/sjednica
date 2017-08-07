// routes.ts

import { LoginComponent } from "./login/login.component";
import { LoginRouteActivatorService } from "./shared/login-route-activator.service";
import { UsersComponent } from "./users/users.component";

import { Routes } from "@angular/router"

export const appRoutes : Routes = [
    { path: "login", component: LoginComponent },
    { path: "users", component: UsersComponent, canActivate: [LoginRouteActivatorService] },
    { path: "", redirectTo: "login", pathMatch: "full" }
]