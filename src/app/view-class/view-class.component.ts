import { Component, OnInit } from '@angular/core';
import { UserService, AuthService } from '../_services';
import { first } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { Subscription } from 'rxjs';
import { ApiService } from '../_services/api.service';
import { FormGroup } from '@angular/forms';
import { SectionFilterPipe } from '../_pipe/section-filter.pipe';
import { ExcelService } from '../_services/excel.service';
import { FileUploader } from 'ng2-file-upload';

const UploadURL = 'http://localhost:4000/file/uploadFile';

@Component({
	selector: 'app-view-class',
	templateUrl: './view-class.component.html',
	styleUrls: ['./view-class.component.scss']
})
export class ViewClassComponent implements OnInit {
	private userSubscription: Subscription[] = [];
	url = 'http://localhost:4000';
	currentUser: any;
	users = [];
	socket;
	section_list = [];
	studentSection: any = "";
	ifRoleStudent: boolean;
	ifRoleCommittee: boolean;
	classmates = [];
	uploadFile: any;
	fileToUpload = false;
	fileName: any;
	fileSize: any;

	constructor(private userService: UserService,
		private api: ApiService,
		private sectionPipe: SectionFilterPipe,
		private authService: AuthService,
		private excelService: ExcelService) {
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		//-----For Realtime--------------
		this.socket = io(this.url);
		this.userSubscription.push(this.userService
			.getData()
			.subscribe((users: string) => {
				this.getAllUsers();
			}));
		//-----For Realtime--------------
		if (authService.currentUserValue != null) {
			if (authService.currentUserValue.role == 'Student') {
				this.ifRoleStudent = true;
				this.getYourClassmates();
			}
			if (authService.currentUserValue.role == 'Committee') {
				this.ifRoleCommittee = true;
				this.getAllUsers();
				this.getSectionList();
			}
		}
		else {
			this.ifRoleStudent = false;
			this.ifRoleCommittee = false;
		}

		this.uploadFile = new FileUploader({
			url: UploadURL, itemAlias: 'files', headers: []
		});
	}

	ngOnInit() {
		this.uploadFile.onAfterAddingFile = (file) => {
			file.withCredentials = false;
			this.fileToUpload = true;
			this.fileName = file['file']['name'];
			this.api.formatBytes(file['file']['size'], 2).subscribe(
				data => {
					this.fileSize = data;
				}
			)
			// console.log(file['file']['size'])
		};
	}

	getSectionList() {
		this.api.getSectionList().subscribe(
			data => {
				this.section_list = data;
				// console.log(data)
			}
		)
	}

	getAllUsers() {
		this.userSubscription.push(
			this.userService.getAll()
				.pipe(first()).subscribe(
					users => {
						this.users = users;
					}
				)
		);
	}

	getYourClassmates() {
		this.userService.getStudentsByYearAndSection(this.currentUser.year, this.currentUser.section).subscribe(
			data => {
				this.classmates = data;
			}
		)
	}

	sectionFilter() {
		// this.getAllUsers();
	}

	tryDelete(id) {
		console.log(id)
		console.log("sad");
	}

	onFileChange(e) {
		this.excelService.onFileChange(e);
	}

	Upload() {
		this.excelService.Upload();
	}

	ngOnDestroy() {
		this.userSubscription.forEach(Subscription => Subscription.unsubscribe());
	}

}
