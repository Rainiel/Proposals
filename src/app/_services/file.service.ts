import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
	url = 'http://localhost:4000';
	constructor(private http: HttpClient) { }

	uploadPhoto(item, status, response) {
		console.log(item, status)
		return this.http.post(`${this.url}/file/uploadPhoto`, item, status);
	}

	getFile(folder_name){
		return this.http.get<any>(`${this.url}/file/getFile/${folder_name}`);
	}

}
