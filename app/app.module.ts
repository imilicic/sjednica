// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { Error404Component } from './errors/error-404.component';
import { LoginComponent } from './login/login.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthenticationService } from './shared/services/authentication.service';
import { ResponseMessagesService } from './shared/services/response-messages.service';
import { ToastrService } from './shared/services/toastr.service';
import { AuthenticationRouteActivatorService } from './shared/services/authentication-route-activator.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// export function authHttpServiceFactory(http: Http, options: RequestOptions) {
//   return new AuthHttp(new AuthConfig({
//     tokenName: 'auth_token',
//     tokenGetter: (() => localStorage.getItem('auth_token')),
//     globalHeaders: [{'Content-Type': 'application/json'}],
//   }), http, options);
// }

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
    MeetingsComponent,
    NavbarComponent
  ],
  providers: [
    AuthenticationRouteActivatorService,
    AuthenticationService,
    ResponseMessagesService,
    ToastrService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
