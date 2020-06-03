import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class NodemailService {
  url = 'http://localhost:4000';
	observable:Observable<string>;
	socket;

  constructor(private http: HttpClient) { }

  nodemail(userId, title){
		return this.http.get(`${this.url}/mail/nodemail/${userId}/${title}`);
  }
  
  mailDecision(fname, lname, decision, comment, proposalId){
		return this.http.get(`${this.url}/mail/mailDecision/${fname}/${lname}/${decision}/${comment}/${proposalId}`);
  }

  approvedProposal(proposalId){
    return this.http.get(`${this.url}/mail/approvedProposal/${proposalId}`);
  }

  defenseSched(week){
    return this.http.get(`${this.url}/mail/defenseSched/${week}`);
  }
}
