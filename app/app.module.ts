// app.module.ts

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, Http, RequestOptions } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AuthHttp, AuthConfig } from "angular2-jwt";

import { AppComponent } from "./app.component";
import { Error404Component } from "./errors/error-404.component";
import { MeetingsComponent } from "./meetings/meetings.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ResponseMessagesService } from "./shared/providers/response-messages.service";
import { ToastrService } from "./shared/providers/toastr.service";
import { UserService } from "./user/shared/providers/user.service";
import { UserRouteActivatorService } from "./user/shared/providers/user-route-activator.service";

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
    MeetingsComponent,
    NavbarComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    ResponseMessagesService,
    ToastrService,
    UserRouteActivatorService,
    UserService
  ]
})
export class AppModule { }
