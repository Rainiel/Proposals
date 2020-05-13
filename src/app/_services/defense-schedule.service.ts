import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class DefenseScheduleService {
	url = 'http://localhost:4000';

	constructor(private http: HttpClient) { }

	getSchedule() {
		return this.http.get<any>(`${this.url}/defense_schedule`);
	}

	create(schedule) {
		return this.http.post(`${this.url}/defense_schedule/create`, schedule);
	}

	update(id, schedule) {
		return this.http.put(`${this.url}/defense_schedule/update/${id}`, schedule);
	}

	delete(id: number) {
		return this.http.delete(`${this.url}/defense_schedule/${id}`);
	}

}
