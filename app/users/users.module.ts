import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AdminRouteActivatorService } from './shared/services/admin-route-activator.service';
import { CouncilMembershipService } from './shared/services/council-membership.service';
import { UserService } from './shared/services/user.service';
import { RolePipe } from './shared/role.pipe';
import { UserComponent } from './user/user.component';
import { UserResolverService } from './shared/services/user-resolver.service';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { PasswordService } from '../shared/services/password.service';
import { ResponseMessagesService } from '../shared/services/response-messages.service';
import { ToastrService } from '../shared/services/toastr.service';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'auth_token',
        tokenGetter: (() => localStorage.getItem('auth_token')),
        globalHeaders: [{'Content-Type': 'application/json'}],
    }), http, options);
}

@NgModule({
    declarations: [
        RolePipe,
        UsersComponent,
        UserCreateComponent,
        UserUpdateComponent,
        UserComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        UsersRoutingModule
    ],
    providers: [
        AdminRouteActivatorService,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        CouncilMembershipService,
        PasswordService,
        ResponseMessagesService,
        ToastrService,
        UserResolverService,
        UserService
    ]
})
export class UsersModule {}
