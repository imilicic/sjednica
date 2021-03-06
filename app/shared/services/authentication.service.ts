import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User } from '../models/user.model';

@Injectable()
export class AuthenticationService {
    jwtHelper: JwtHelper = new JwtHelper();
    user: User = undefined;

    constructor (
        private http: Http
    ) {}

    isAdmin(): boolean {
        if (this.user) {
            return this.user.RoleId === 1;
        }

        return false;
    }

    isCouncilMember(): boolean {
        if (this.user) {
            let startDate = new Date(this.user.CouncilMemberships[0].StartDate);
            let endDate = new Date(this.user.CouncilMemberships[0].EndDate);
            let now = new Date();

            return (startDate <= now && now <= endDate);
        }

        return false;
    }

    isAuthenticated(): boolean {
        let auth_token = localStorage.getItem('auth_token');

        if (auth_token) {
            if (!this.user) {
                this.user = this.jwtHelper.decodeToken(auth_token);
            }

            return !this.jwtHelper.isTokenExpired(auth_token);
        }

        return false;
    }

    loginUser(values: {Email: string, Password: string}): Observable<{auth_token: string}> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/authentication', values, options)
            .map((response: Response) => {
                let responseJson = response.json();

                localStorage.setItem('auth_token', responseJson.auth_token);
                this.user = this.jwtHelper.decodeToken(responseJson.auth_token);

                return responseJson;
            })
            .catch(this.handleError);
    }

    logoutUser(): void {
        localStorage.removeItem('auth_token');
        this.user = undefined;
    }

    private handleError(error: Response) {
        return Observable.throw(error.text());
    }
}
