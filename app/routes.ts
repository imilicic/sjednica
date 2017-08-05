// routes.ts

import { LoginComponent } from './login/login.component'

import { Routes } from '@angular/router'

export const appRoutes : Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
]