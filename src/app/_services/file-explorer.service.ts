import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class FileExplorerService {
	url = 'http://localhost:4000';

	constructor(private http: HttpClient) { }

	getFolders() {
		return this.http.get<any>(`${this.url}/file_explorer`);
	}

	create(folders) {
		return this.http.post(`${this.url}/file_explorer/create`, folders);
	}

	update(id, schedule) {
		return this.http.put(`${this.url}/defense_schedule/update/${id}`, schedule);
	}

	delete(id: number) {
		return this.http.delete(`${this.url}/defense_schedule/${id}`);
	}
}
