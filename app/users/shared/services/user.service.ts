import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
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

    retrieveUser(userId: number): Observable<User> {
        return this.authHttp.get('/api/users/' + userId)
        .map((response: Response) => <User>response.json())
        .catch(this.handleError);
    }

    retrieveUsers(): Observable<User[]> {
        return this.authHttp.get('/api/users')
        .map((response: Response) => <User[]>response.json())
        .catch(this.handleError);
    }

    replaceUserAdmin(user: User): Observable<User> {
        return this.authHttp.put('/api/users/' + user.UserId, user)
        .map((response: Response) => <User>response.json())
        .catch(this.handleError);
    }

    replaceUserUser(user: User, oldPassword: string): Observable<User> {
        return this.authHttp.put('/api/users/' + user.UserId + '?OldPassword=' + oldPassword, user)
        .map((response: Response) => <User>response.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text());
    }
}
