import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { UsersComponent } from './users.component';
import { AdminRouteActivatorService } from './shared/services/admin-route-activator.service';
import { UserComponent } from './user/user.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserResolverService } from './user/user-resolver.service';
import { AuthenticationRouteActivatorService } from '../shared/services/authentication-route-activator.service';

export const userRoutes: Routes = [
    {
        path: '',
        component: UsersComponent,
        canActivate: [
            AuthenticationRouteActivatorService,
            AdminRouteActivatorService
        ]
    },
    {
        path: 'me',
        component: UserComponent,
        canActivate: [AuthenticationRouteActivatorService]
    },
    {
        path: 'create',
        component: UserCreateComponent,
        canActivate: [
            AuthenticationRouteActivatorService,
            AdminRouteActivatorService
        ]
    },
    {
        path: ':userId',
        component: UserComponent,
        canActivate: [
            AuthenticationRouteActivatorService,
            AdminRouteActivatorService
        ],
        resolve: {
            user: UserResolverService
        }
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes)
    ],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
