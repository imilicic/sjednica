import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, Http, RequestOptions } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AuthHttp, AuthConfig } from "angular2-jwt";

import { UserComponent } from "./user.component";
import { userRoutes } from "./user-routes";
import { AdminRouteActivatorService } from "./shared/providers/admin-route-activator.service";
import { UserRouteActivatorService } from "./shared/providers/user-route-activator.service";
import { UserService } from "./shared/providers/user.service";
import { UserCreateComponent } from "./user-create/user-create.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { PasswordService } from "../shared/providers/password.service";
import { ResponseMessagesService } from "../shared/providers/response-messages.service";
import { ToastrService } from "../shared/providers/toastr.service";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'auth_token',
		tokenGetter: (() => localStorage.getItem('auth_token')),
		globalHeaders: [{'Content-Type':'application/json'}],
	}), http, options);
}

@NgModule({
    declarations: [
        UserComponent,
        UserCreateComponent,
        UserLoginComponent,
        UserProfileComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forChild(userRoutes)
    ],
    providers: [
        AdminRouteActivatorService,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        PasswordService,
        ResponseMessagesService,
        ToastrService,
        UserRouteActivatorService,
        UserService
    ]
})
export class UserModule {}