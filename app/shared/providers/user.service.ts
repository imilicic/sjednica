// user.service.ts

import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { AuthHttp, JwtHelper } from "angular2-jwt";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { User } from "../models/user.model";

@Injectable()
export class UserService {
    jwtHelper: JwtHelper = new JwtHelper();
    user: User;

    changePassword(formValues: any): Observable<string> {
        return this.authHttp.put("/api/put/users/password", formValues)
        .map((response: Response) => response.text())
        .catch(this.handleError);
    }

    constructor (
        private authHttp: AuthHttp,
        private http: Http
    ) {}

    createUser(userValues: any): Observable<string> {
        return this.authHttp.post("/api/create/user", userValues)
        .map((response: Response) => response.text())
        .catch(this.handleError);
    }

    isAdmin(): boolean {
        if (this.user) {
            return this.user.RoleName == "admin";
        }

        return false;
    }

    isAuthenticated(): boolean {
        let auth_token = localStorage.getItem("auth_token");

        if (auth_token) {
            if (!this.user) {
                this.user = this.jwtHelper.decodeToken(auth_token);
            }

            return !this.jwtHelper.isTokenExpired(auth_token);
        }

        return false;
    } 

    getUsers(): Observable<User[]> {
        return this.authHttp.get("/api/get/users")
        .map((response: Response) => <User[]>response.json().users)
        .catch(this.handleError);
    }

    login(values: any): Observable<any> {
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.http.post("/api/login", values, options)
        .map((response: Response) => {
            let responseJson = response.json();

            localStorage.setItem("auth_token", responseJson.auth_token);
            this.user = this.jwtHelper.decodeToken(responseJson.auth_token);

            return responseJson;
        })
        .catch(this.handleError);
    }

    logout(): void {
        localStorage.removeItem("auth_token");
        this.user = undefined;
    }

    private handleError (error: Response) {
        return Observable.throw(error.text());
    }
}