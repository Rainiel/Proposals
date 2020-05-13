import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee } from '../_models';

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {
	url = 'http://localhost:4000';

	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(`${this.url}/employee`);
	}

	getById(id) {
		return this.http.get<any>(`${this.url}/employee/${id}`);
	}

	register(employee: Employee) {
		return this.http.post(`${this.url}/employee/register`, employee);
	}

	update(id: any, user: any) {
		return this.http.put(`${this.url}/employee/update/${id}`, user);
	}

	delete(id: number) {
		return this.http.delete(`${this.url}/employee/${id}`);
	}

}
