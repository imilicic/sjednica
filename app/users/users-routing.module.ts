import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { UsersComponent } from './users.component';
import { AdminRouteActivatorService } from './shared/services/admin-route-activator.service';
import { UserComponent } from './user/user.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserResolverService } from './user/user-resolver.service';

export const userRoutes: Routes = [
    {
        path: '',
        component: UsersComponent,
        canActivate: [
            AdminRouteActivatorService
        ]
    },
    {
        path: 'me',
        component: UserComponent
    },
    {
        path: 'create',
        component: UserCreateComponent,
        canActivate: [
            AdminRouteActivatorService
        ]
    },
    {
        path: ':userId',
        component: UserComponent,
        canActivate: [
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
