import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { UsersComponent } from './users.component';
import { AdminRouteActivatorService } from '../shared/services/admin-route-activator.service';
import { CouncilMembershipResolverService } from './shared/services/council-membership-resolver.service';
import { UserResolverService } from './shared/services/user-resolver.service';
import { UserComponent } from './user/user.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';

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
            user: UserResolverService,
            councilMemberships: CouncilMembershipResolverService
        }
    },
    {
        path: 'update/me',
        component: UserUpdateComponent
    },
    {
        path: 'update/:userId',
        component: UserUpdateComponent,
        canActivate: [
            AdminRouteActivatorService
        ],
        resolve: {
            user: UserResolverService,
            councilMemberships: CouncilMembershipResolverService
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
