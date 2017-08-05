import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { LoginService } from "./login/login.service";
import { NavbarComponent } from "./navbar/navbar.component";
import { appRoutes } from "./routes";

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
    NavbarComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    LoginService
  ]
})
export class AppModule { }
