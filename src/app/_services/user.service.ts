import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

import { User } from '../_models';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	url = 'http://localhost:4000';
	observable: Observable<string>;
	socket;
	userGroup = [];

	constructor(private http: HttpClient) {
		this.socket = io(this.url);
	}
	//-----For Realtime--------------
	getData(): Observable<string> {
		return this.observable = new Observable((observer) => {
			this.socket.on('userData', (data) => observer.next(data)
			);
		})
	}
	//-----For Realtime--------------
	getUserWithoutGroup(section, year) {
		return this.http.get<any>(`${this.url}/users/usersWithoutGroup/${section}/${year}`);
	}

	getById(id) {
		return this.http.get<any>(`${this.url}/users/${id}`);
	}

	getAll() {
		return this.http.get<User[]>(`${this.url}/users`);
	}

	getAvatar(user_id) {
		return this.http.get<any>(`${this.url}/users/getAvatar/${user_id}`);
	}

	getStudentsByYearAndSection(year, section){
		return this.http.get<any>(`${this.url}/users/getStudentsByYearAndSection/${year}/${section}`);
	}

	register(user: User) {
		return this.http.post(`${this.url}/users/register`, user);
	}

	update(id: any, user: any) {
		return this.http.put(`${this.url}/users/update/${id}`, user);
	}

	updateGroup(id: any, user: User) {
		id.forEach(element => {
			console.log(element._id)
			return this.http.put(`${this.url}/users/update/${element._id}`, user);
		});
	}

	delete(id: number) {
		return this.http.delete(`${this.url}/users/${id}`);
	}
}
