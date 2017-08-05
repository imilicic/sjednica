// login.service.ts

import { Injectable, OnInit } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";

import { User } from "../shared/models/user.model";

@Injectable()
export class LoginService implements OnInit {
    private loggedIn: boolean;

    constructor (private http: Http) {}
    
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
            }

            return responseJson;
        })
        .catch(this.handleError);
    }

    logout() {
        localStorage.removeItem("auth_token");
        this.loggedIn = false;
    }

    ngOnInit() {
        this.loggedIn = !!localStorage.getItem("auth_token");
    }

    private handleError (error: Response) {
        return Observable.throw(error.statusText);
    }
}