import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { proposal_file } from '../_models';
import { Observable } from 'rxjs/internal/Observable';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ProposalsService {
	url = 'http://localhost:4000';
	observable:Observable<string>;
	socket;

	constructor(private http: HttpClient) {
		this.socket = io(this.url);
	 }
//-----For Realtime--------------
	getProposals():Observable<string>{
		return  this.observable=new Observable((observer)=>{
		  	this.socket.on('proposalData',(data)=>observer.next(data)
			);
		})
	}
	getApproveReject():Observable<string>{
		return  this.observable=new Observable((observer)=>{
		  	this.socket.on('ApproveRejectData',(data)=>observer.next(data)
			);
		})
	}
	getProposalCommentData():Observable<string>{
		return  this.observable=new Observable((observer)=>{
		  	this.socket.on('ProposalCommentData',(data)=>observer.next(data)
			);
		})
	}
//-----For Realtime--------------

	getAll(){
		return this.http.get(`${this.url}/file`);
	}
	
	createProposalApproveReject(proposal_id, user_id, ApproveReject){
		return this.http.post<any>(`${this.url}/proposal/approve_reject/${proposal_id}/${user_id}`, ApproveReject);
	}

	createProposalComment(comment){
		return this.http.post<any>(`${this.url}/proposal/comment`, comment);
	}

	updateProposalComment(proposal_id, committee_id, comment){
		return this.http.put(`${this.url}/proposal/updateProposalComment/${proposal_id}/${committee_id}`, comment);
	}

	createProposal(proposal){
		return this.http.post<any>(`${this.url}/proposal/create`, proposal);
	}

	createProposalFile(proposalFile: any){
		return this.http.post(`${this.url}/proposal/proposalFile`, proposalFile);
	}

	checkProposalCommentIfExisting(proposal_id, committee_id){
		return this.http.get<any>(`${this.url}/proposal/checkProposalCommentIfExisting/${proposal_id}/${committee_id}`);
	}

	getProposalApproveReject(proposal_id){
		return this.http.get<any>(`${this.url}/proposal/get_approve_reject/${proposal_id}`);
	}

	getProposalComment(proposal_id){
		return this.http.get<any>(`${this.url}/proposal/getComment/${proposal_id}`);
	}

	getProposalFile(proposal_id){
		return this.http.get<any>(`${this.url}/proposal/getProposalFile/${proposal_id}`);
	}

	getById(id){
		return this.http.get<any>(`${this.url}/proposal/${id}`);
	}

	getProposal(){
		return this.http.get<any>(`${this.url}/proposal`);
	}

	getProposalApproveCount(proposal_id){
		return this.http.get<any>(`${this.url}/proposal/get_approve_count/${proposal_id}`);
	}

	getProposalRejectCount(proposal_id){
		return this.http.get<any>(`${this.url}/proposal/get_reject_count/${proposal_id}`);
	}

	getOwnProposal(group_id){
		return this.http.get<any>(`${this.url}/proposal/getOwnProposal/${group_id}`);
	}

	update(proposal_id, param: any) {
		return this.http.put(`${this.url}/proposal/update/${proposal_id}`, param);
	}

	updateComment(comment_id, param: any){
		return this.http.put(`${this.url}/proposal/updateComment/${comment_id}`, param);
	}

	updateProposalDecision(proposal_id, param: any) {
		return this.http.put(`${this.url}/proposal/updateProposalDecision/${proposal_id}`, param);
	}

	deleteComment(id) {
		return this.http.delete(`${this.url}/proposal/deleteComment/${id}`);
	}
}
