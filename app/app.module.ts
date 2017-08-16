// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';

import { Error404Component } from './errors/error-404.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthenticationService } from './shared/services/authentication.service';
import { ResponseMessagesService } from './shared/services/response-messages.service';
import { ToastrService } from './shared/services/toastr.service';
import { AuthenticationRouteActivatorService } from './shared/services/authentication-route-activator.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

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
    AuthenticationRouteActivatorService,
    AuthenticationService,
    ResponseMessagesService,
    ToastrService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
