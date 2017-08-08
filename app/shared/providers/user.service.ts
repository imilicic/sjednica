// user.service.ts

import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { User } from "../models/user.model";

@Injectable()
export class UserService {
    user: User;

    private loggedIn: boolean;

    changePassword(formValues: any): Observable<any> {
        let headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("auth_token")
        });
        let options = new RequestOptions({ headers: headers });

        return this.http.put("/api/put/users/password", formValues, options)
        .map((response: Response) => {
            let responseJson = response.json();

            if(responseJson.success) {
                localStorage.setItem("auth_token", responseJson.token);
            }

            return responseJson;
        })
        .catch(this.handleError);
    }

    constructor (private http: Http) {
        let authToken = localStorage.getItem("auth_token");
        this.loggedIn = !!authToken;
        
        if (this.loggedIn && this.user == undefined) {
            let headers = new Headers({
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authToken
            });

            let options = new RequestOptions({ headers: headers });

            this.http.get("/api/get/users/current", options)
            .map((response: Response) => {
                this.user = <User>response.json();
            }).subscribe();
        }
    }

    isAdmin() {
        if (this.user) {
            return this.user.RoleName == "admin";
        }

        return false;
    }

    isAuthenticated() {
        return this.loggedIn;
    } 

    getUsers(): Observable<User[]> {
        let headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("auth_token")
        });
        let options = new RequestOptions({headers: headers});

        return this.http.get("/api/get/users", options)
        .map((response: Response) => {
            let responseJson = response.json();
            return <User[]>responseJson.users;
        })
        .catch(this.handleError);
    }

    login(values: any): Observable<any> {
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