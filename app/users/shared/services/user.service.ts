// user.service.ts

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User } from '../../../shared/models/user.model';

@Injectable()
export class UserService {
    constructor (
        private authHttp: AuthHttp
    ) {}

    createUser(userValues: Object): Observable<string> {
        return this.authHttp.post('/api/users', userValues)
        .map((response: Response) => response.text())
        .catch(this.handleError);
    }

    getUser(userId: number): Observable<User> {
        return this.authHttp.get('/api/users/' + userId)
        .map((response: Response) => <User>response.json())
        .catch(this.handleError);
    }

    getUsers(): Observable<User[]> {
        return this.authHttp.get('/api/users')
        .map((response: Response) => <User[]>response.json().users)
        .catch(this.handleError);
    }

    updateUser(userValues: any): Observable<string> {
        return this.authHttp.put('/api/users/' + userValues.UserId, userValues)
        .map((response: Response) => response.text())
        .catch(this.handleError);
    }

    // updateUser(newUser: User) {
    //     console.log(newUser);
    //     // return this.authHttp.post('/api/update/user', newUser)
    //     // .map((response: Response) => response.text())
    //     // .catch(this.handleError);
    // }

    private handleError (error: Response) {
        return Observable.throw(error.text());
    }
}
