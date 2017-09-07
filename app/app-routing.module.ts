// routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { Error404Component } from './errors/error-404.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationRouteActivatorService } from './shared/services/authentication-route-activator.service';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'council-memberships',
        loadChildren: 'app/council-memberships/council-memberships.module#CouncilMembershipsModule',
        canActivate: [AuthenticationRouteActivatorService]
    },
    {
        path: 'meetings',
        loadChildren: 'app/meetings/meetings.module#MeetingsModule',
        canActivate: [AuthenticationRouteActivatorService] },
    {
        path: 'users',
        loadChildren: 'app/users/users.module#UsersModule',
        canActivate: [AuthenticationRouteActivatorService] },
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full' },
    {
        path: '**',
        component: Error404Component
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
