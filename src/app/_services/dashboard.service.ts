import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
	url = 'http://localhost:4000';

	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(`${this.url}/dash`);
	}

	create(schedule) {
		return this.http.post(`${this.url}/dash/create`, schedule);
	}

	update(id, schedule) {
		return this.http.put(`${this.url}/dash/update/${id}`, schedule);
	}

	delete(id: number) {
		return this.http.delete(`${this.url}/dash/${id}`);
  }
  
  getProposals(){
    return this.http.get<any>(`${this.url}/proposal`);
  }

  getGroups(){
    return this.http.get<any>(`${this.url}/group`);
  }

  getStudents(){
    return this.http.get<any>(`${this.url}/users`);
  }

  

}