import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoginRouteActivatorService } from "./shared/login-route-activator.service";
import { LoginService } from "./shared/providers/login.service";
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
    LoginComponent,
    NavbarComponent,
    UsersComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    LoginRouteActivatorService,
    LoginService
  ]
})
export class AppModule { }
