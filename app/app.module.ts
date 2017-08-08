// app.module.ts

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { Error404Component } from "./errors/error-404.component";
import { LoginComponent } from "./login/login.component";
import { MeetingsComponent } from "./meetings/meetings.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { UserRouteActivatorService } from "./shared/user-route-activator.service";
import { ResponseMessagesService } from "./shared/providers/response-messages.service";
import { ToastrService } from "./shared/providers/toastr.service";
import { UserService } from "./shared/providers/user.service";
import { UserProfileComponent } from "./users/profile/user-profile.component";
import { UsersComponent } from "./users/users.component";

import { appRoutes } from "./app-routes";

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
    UserProfileComponent,
    UsersComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    ResponseMessagesService,
    ToastrService,
    UserRouteActivatorService,
    UserService
  ]
})
export class AppModule { }
