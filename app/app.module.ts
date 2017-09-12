import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AdminRouteActivatorService } from './shared/services/admin-route-activator.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationRouteActivatorService } from './shared/services/authentication-route-activator.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { Error404Component } from './errors/error-404.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ResponseMessagesService } from './shared/services/response-messages.service';
import { RoleService } from './shared/services/role.service';
import { ToastrService } from './shared/services/toastr.service';
import { TypeService } from './shared/services/type.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'auth_token',
        tokenGetter: (() => localStorage.getItem('auth_token')),
        globalHeaders: [{'Content-Type': 'application/json'}],
    }), http, options);
}

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    Error404Component,
    LoginComponent,
    NavbarComponent
  ],
  providers: [
    AdminRouteActivatorService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthenticationRouteActivatorService,
    AuthenticationService,
    ResponseMessagesService,
    RoleService,
    ToastrService,
    TypeService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
