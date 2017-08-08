// routes.ts

import { Error404Component } from "./errors/error-404.component";
import { LoginComponent } from "./login/login.component";
import { MeetingsComponent } from "./meetings/meetings.component";
import { UserRouteActivatorService } from "./shared/user-route-activator.service";
import { UserProfileComponent } from "./users/profile/user-profile.component";
import { UsersComponent } from "./users/users.component";

import { Routes } from "@angular/router"

export const appRoutes : Routes = [
    { path: "login", component: LoginComponent },
    { path: "users", component: UsersComponent, canActivate: [UserRouteActivatorService] },
    { path: "users/me", component: UserProfileComponent, canActivate: [UserRouteActivatorService] },
    { path: "meetings", component: MeetingsComponent, canActivate: [UserRouteActivatorService] },
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "**", component: Error404Component }
]