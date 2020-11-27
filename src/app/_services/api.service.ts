import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Group, User } from '../_models';
import { first } from 'rxjs/operators';
import { GroupService } from './group.service';
import { AuthService } from './auth.service';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs';
import { UserService } from './user.service';
import { section_list } from '../_models';
import { ProposalsService } from './proposals.service';
import * as io from 'socket.io-client';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	currentUser: User;
	url = 'http://localhost:4000';
	observable: Observable<string>;
	socket;

	constructor(private http: HttpClient,
		private groupService: GroupService,
		private authService: AuthService,
		private userService: UserService,
		private proposalService: ProposalsService) {
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		this.socket = io(this.url);
	}
	//-----For Realtime--------------
	getSectionListData(): Observable<string> {
		return this.observable = new Observable((observer) => {
			this.socket.on('SectionListData', (data) => observer.next(data)
			);
		})
	}
	//-----For Realtime--------------
	getSectionColor2(year, section, groupName, group_id): Observable<any> {
		var subject = new Subject<any>();
		this.getSectionColor(year, section).subscribe(
			data => {
				// console.log({group: groupName, color: data[0].color});
				subject.next({ group: groupName, color: data[0].color, group_id: group_id });
			}
		)
		return subject.asObservable();
	}

	getSectionColor(year, section) {
		return this.http.get<any>(`${this.url}/api/get_section_color/${year}/${section}`);
	}

	getProposalMembers(proposal_id): Observable<any> {
		var subject = new Subject<any>();
		this.proposalService.getById(proposal_id).subscribe(
			data => {
				// console.log(data.group_id)
				this.groupService.getById(data.group_id).subscribe(
					data => {
						// console.log(data.groupMembers)
						subject.next(data.groupMembers);
					}
				)
			}
		)
		return subject.asObservable();
	}

	getUserNavigation() {
		return this.http.get<any>(`${this.url}/api/user_navigation`);
	}

	getEmployeeNavigation() {
		return this.http.get<any>(`${this.url}/api/employee_navigation`);
	}

	getSectionList() {
		return this.http.get<any>(`${this.url}/api/section_list`);
	}

	getProposalTableColumn() {
		return this.http.get<any>(`${this.url}/api/proposal_table_column`);
	}

	getAvatar(user_id) {
		return this.http.get(`${this.url}/api/getAvatar/${user_id}`);
	}

	getAvatarCommittee(user_id) {
		return this.http.get(`${this.url}/api/getAvatarCommittee/${user_id}`);
	}

	getSectionAdviser(year, section) {
		return this.http.get(`${this.url}/api/getSectionAdviser/${year}/${section}`)
	}

	updateAvatar(avatar) {
		return this.http.put(`${this.url}/api/updateAvatar`, avatar);
	}

	selectAvatar(avatar) {
		return this.http.put(`${this.url}/api/selectAvatar`, avatar);
	}

	updateProposalApproveCount(proposal_id, update_approve) {
		return this.http.put<any>(`${this.url}/proposal/update/${proposal_id}`, update_approve);
	}

	sectionAdviser(section, adviser) {
		return this.http.put(`${this.url}/api/section_adviser/${section}`, adviser);
	}

	userNavigation(unav_id, show_hide) {
		return this.http.put(`${this.url}/api/user_nav/${unav_id}`, show_hide);
	}

	employeeNavigation(unav_id, show_hide) {
		return this.http.put(`${this.url}/api/employee_nav/${unav_id}`, show_hide);
	}

	createYearAndSection(YearAndSection) {
		return this.http.put(`${this.url}/api/createYearAndSection`, YearAndSection);
	}

	getCurrentBatch() {
		return this.http.get(`${this.url}/api/getCurrentBatch`);
	}

	updateCurrentBatch(currentBatch) {
		return this.http.put(`${this.url}/api/updateCurrentBatch`, currentBatch);
	}

	updateColorSection(section_id, sectionColor) {
		return this.http.put(`${this.url}/api/updateColorSection/${section_id}`, sectionColor);
	}

	createGroup(groupmembers, status) {
		for (let i = 0; i < groupmembers.length; i++) {
			this.userService.update(groupmembers[i]._id, status)
				.pipe(first())
				.subscribe(
					data => {
						console.log(data)
					},
					error => {
						console.log(error)
					});
		}
	}

	formatBytes(bytes: number, decimals: number): Observable<any> {
		var filesize;
		if (bytes == 0) {
			filesize = "0 Bytes";
		} else {
			var k = 1024,
				dm = decimals <= 0 ? 0 : decimals || 2,
				sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
				i = Math.floor(Math.log(bytes) / Math.log(k));
			filesize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
		}
		return of(filesize);
	}

	getUserGroupnameAndId(id): Observable<any> {
		var subject = new Subject<any>();
		this.userService.getById(id)
			.subscribe(
				data => {
					var object;
					object = data;
					this.groupService.getById(object.groupProposal_id)
						.subscribe(
							data => {
								var object
								object = data;
								// console.log(object.groupName)
								subject.next([object.groupName, object._id])
							}
						)
				}
			)
		return subject.asObservable();
	}

	checkIfUserHaveGroup(): Observable<boolean> {
		var subject = new Subject<boolean>();
		this.userService.getById(this.currentUser._id)
			.subscribe(
				data => {
					var object;
					object = data;
					// console.log(object.groupProposal_id)
					if (!!object.group_proposal_id) {
						subject.next(true)
					} else {
						subject.next(false)
					}
				}
			)
		return subject.asObservable();
	}

	//FOR LOADING JS FILE
	loadScript(url: string) {
		const body = <HTMLDivElement>document.body;
		const script = document.createElement('script');
		script.innerHTML = '';
		script.src = url;
		script.async = false;
		script.defer = true;
		body.appendChild(script);
	}

	//FORM match 2 string
	MustMatch(controlName: string, matchingControlName: string) {
		return (formGroup: FormGroup) => {
			const control = formGroup.controls[controlName];
			const matchingControl = formGroup.controls[matchingControlName];
			if (matchingControl.errors && !matchingControl.errors.mustMatch) {
				// return if another validator has already found an error on the matchingControl
				return;
			}
			// set error on matchingControl if validation fails
			if (control.value !== matchingControl.value) {
				matchingControl.setErrors({ mustMatch: true });
			} else {
				matchingControl.setErrors(null);
			}
		}
	}
}
