import { Routes } from "@angular/router"

import { UserComponent } from "./user.component";
import { AdminRouteActivatorService } from "./shared/providers/admin-route-activator.service";
import { UserRouteActivatorService } from "./shared/providers/user-route-activator.service";
import { UserCreateComponent } from "./user-create/user-create.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

export const userRoutes : Routes = [
    { path: "login", component: UserLoginComponent },
    { path: "", component: UserComponent, canActivate: [UserRouteActivatorService, AdminRouteActivatorService] },
    { path: "me", component: UserProfileComponent, canActivate: [UserRouteActivatorService] },
    { path: "create", component: UserCreateComponent, canActivate: [UserRouteActivatorService, AdminRouteActivatorService] }
]