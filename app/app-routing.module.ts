// routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { Error404Component } from './errors/error-404.component';
import { LoginComponent } from './login/login.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { AuthenticationRouteActivatorService } from './shared/services/authentication-route-activator.service';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'meetings', component: MeetingsComponent, canActivate: [AuthenticationRouteActivatorService] },
    { path: 'users', loadChildren: 'app/users/users.module#UsersModule' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', component: Error404Component }
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
