import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
	url = 'http://localhost:4000';

 	 constructor(private http: HttpClient) { }

  	getAll() {
        return this.http.get<any>(`${this.url}/calendar`);
    }

    create(event) {
        return this.http.post<any>(`${this.url}/calendar/createEvent`, event);
	}
	
	update(id, event) {
		return this.http.put(`${this.url}/calendar/updateEvent/${id}`, event);
	}

    delete(id) {
        return this.http.delete(`${this.url}/calendar/${id}`);
	}
}
