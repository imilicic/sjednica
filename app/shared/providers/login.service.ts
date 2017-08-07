// login.service.ts

import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { User } from "../models/user.model";

@Injectable()
export class LoginService {
    user: User;

    private loggedIn: boolean;

    constructor (private http: Http) {
        let authToken = localStorage.getItem("auth_token");
        this.loggedIn = !!authToken;
        
        if (this.loggedIn && this.user == undefined) {
            let headers = new Headers({
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authToken
            });

            let options = new RequestOptions({ headers: headers });

            this.http.get("api/get/users/current", options)
            .map((response: Response) => {
                this.user = <User>response.json();
            }).subscribe();
        }
    }
    
    isAuthenticated() {
        return this.loggedIn;
    } 

    login(values: any) {
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.http.post("/api/login", values, options)
        .map((response: Response) => {
            let responseJson = response.json();

            if (responseJson.success) {
                localStorage.setItem("auth_token", responseJson.token);
                this.loggedIn = true;
                this.user = <User>responseJson.user;
            }

            return responseJson;
        })
        .catch(this.handleError);
    }

    logout() {
        localStorage.removeItem("auth_token");
        this.loggedIn = false;
        this.user = undefined;
    }

    private handleError (error: Response) {
        return Observable.throw(error.statusText);
    }
}