import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Group } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
	url = 'http://localhost:4000';

	constructor(private http: HttpClient) { }

	getById(id){
		return this.http.get<any>(`${this.url}/group/${id}`);
	}

	getAll(){
		return this.http.get<any>(`${this.url}/group`);
    }

	createGroup(group: Group){
		return this.http.post<any>(`${this.url}/group/createGroup`, group);
	}

	getProposalGroup(proposalGroup){
		return this.http.get<any>(`${this.url}/group/getProposalGroup/${proposalGroup}`);
	}

	update(id: any, update) {
		return this.http.put(`${this.url}/group/update/${id}`, update);
	}

}
