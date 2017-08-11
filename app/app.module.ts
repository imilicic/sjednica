// app.module.ts

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, Http, RequestOptions } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AuthHttp, AuthConfig } from "angular2-jwt";

import { AppComponent } from "./app.component";
import { Error404Component } from "./errors/error-404.component";
import { LoginComponent } from "./login/login.component";
import { MeetingsComponent } from "./meetings/meetings.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { UserRouteActivatorService } from "./shared/user-route-activator.service";
import { PasswordService } from "./shared/providers/password.service";
import { ResponseMessagesService } from "./shared/providers/response-messages.service";
import { ToastrService } from "./shared/providers/toastr.service";
import { UserService } from "./shared/providers/user.service";
import { UsersCreateComponent } from "./users/create/users-create.component";
import { UserProfileComponent } from "./users/profile/user-profile.component";
import { UsersComponent } from "./users/users.component";

import { appRoutes } from "./app-routes";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'auth_token',
		tokenGetter: (() => localStorage.getItem('auth_token')),
		globalHeaders: [{'Content-Type':'application/json'}],
	}), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    AppComponent,
    Error404Component,
    LoginComponent,
    MeetingsComponent,
    NavbarComponent,
    UsersCreateComponent,
    UserProfileComponent,
    UsersComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
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
export class AppModule { }
