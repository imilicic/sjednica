// routes.ts

import { Routes } from "@angular/router"

import { Error404Component } from "./errors/error-404.component";
import { MeetingsComponent } from "./meetings/meetings.component";
import { UserRouteActivatorService } from "./user/shared/providers/user-route-activator.service";


export const appRoutes : Routes = [
    { path: "meetings", component: MeetingsComponent, canActivate: [UserRouteActivatorService] },
    { path: "user", loadChildren: "app/user/user.module#UserModule" },
    { path: "", redirectTo: "user/login", pathMatch: "full" },
    { path: "**", component: Error404Component }
]