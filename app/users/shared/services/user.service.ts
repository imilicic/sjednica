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

    createUser(user: User): Observable<User> {
        return this.authHttp.post('/api/users', user)
        .map((response: Response) => <User>response.json())
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

    updateUser(user: User): Observable<User>;
    updateUser(password: Password): Observable<string>;

    updateUser(data: any): Observable<any> {
        let isUser: boolean = ((obj: any): obj is User => obj.Email !== undefined)(data);
        let isPassword: boolean = ((obj: any): obj is Password => obj.NewPassword !== undefined)(data);

        if (isUser) {
            let user: User = data;

            return this.authHttp.put('/api/users/' + user.UserId, user)
            .map((response: Response) => <User>response.json())
            .catch(this.handleError);
        } else if (isPassword) {
            let password: Password = data;

            return this.authHttp.put('/api/users/' + password.UserId, password)
            .map((response: Response) => response.text())
            .catch(this.handleError);
        }
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}

class Password {
    NewPassword: string
    OldPassword: string
    UserId: number
}
