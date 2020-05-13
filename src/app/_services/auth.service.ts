import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { User } from '../_models';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    url = 'http://localhost:4000';

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router, private userService: UserService) {   
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string){
        return this.http.post<any>(`${this.url}/users/authenticate`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                }

            return user;
        }));
	}

	loginEmployee(email: string, password: string) {
        return this.http.post<any>(`${this.url}/employee/authenticate`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                }
            return user;
        }));
	}
	
	updateStatus(uid, value){
		var currentStatus = JSON.parse(localStorage.getItem('currentUser'));
		currentStatus.status = value.status;
		currentStatus.status_id = value.status_id;
		localStorage.setItem('currentUser',JSON.stringify(currentStatus));
		this.userService.update(uid, value)
		.pipe(first())
		.subscribe(
			data => {
				window.location.reload();
			}
		);

	}

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        // window.location.reload();
	}
	
	logoutEmployee() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        // window.location.reload();
    } 
}
