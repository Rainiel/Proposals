import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../_services/api.service';

import { User } from '../_models';
import { AuthService, UserService } from '../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { ActivityService } from '../_services/activity.service';
import { Router } from '@angular/router';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';

const UploadURL = 'http://localhost:4000/upload/uploadPhoto';

@Component({
	selector: 'app-student-navigation',
	templateUrl: './student-navigation.component.html',
	styleUrls: ['./student-navigation.component.scss']
})
export class StudentNavigationComponent implements OnInit {
	currentUser: User;
	update_status: any;
	avatar_pic: any;
	submitted = false;
	imagePath;
	imgURL: any;
	message: string;
	navigations = [];
	withChildNav = [];
	avatar: any;
	user_avatar: any;
	ifuser_avatar: any;

	uploader: FileUploader = new FileUploader({ url: UploadURL, itemAlias: 'photo' });
	activities: Object;

	constructor(
		private api: ApiService,
		private authService: AuthService,
		private userService: UserService,
		private formBuilder: FormBuilder,
		public fb: FormBuilder,
		private router: Router,
		private activityService: ActivityService) {
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		this.getUserNavigation();
		this.getAvatar();
		this.getActivities();

		// this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		// this.authService.currentUser.subscribe(x => this.currentUser = x);
		// this.currentUser = this.authService.currentUserValue();

		this.update_status = this.formBuilder.group({
			status: ['offline'],
			status_id: ['0']
		});

		this.avatar_pic = this.formBuilder.group({
			avatar_photo: [''],
			avatar_path: [''],
		});
	}

	ngOnInit() {
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		this.api.loadScript("../../assets/sidebar/js/main.js");

		this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			console.log('FileUpload:uploaded:', item, status, response);
		};
	}

	viewActivity(link, id) {
		this.router.navigate([`/${link}`], { queryParams: { name: id } });
	}

	getActivities() {
		let activities = [];
		this.activityService.getActivityStudents(this.currentUser.year, this.currentUser.section, this.currentUser.created_batch_year, this.currentUser.created_batch_sem).subscribe(
			data => {
				for (let i = 0; i < data.length; i++) {
					this.userService.getById(data[i].user_id).subscribe(
						user=> {
							activities.push({...user, ...data[i]});
						}
					);
				}
			}, err => { },
			() => {
				this.activities = activities;
				console.log(this.activities)
			}
		);
	}

	getUserNavigation() {
		this.api.getUserNavigation().subscribe(
			data => {
				// console.log(data);
				for (let i = 0; i < data.length; i++) {
					// this.navigations.push(data[i]);
					if (data[i].boolean == true) {
						this.navigations.push(data[i]);
					}
					for (let k = 0; k < data[i].notification.length; k++) {
						// console.log(data[i].notification)
					}
				}
				// console.log(this.navigations);
				// console.log(this.withChildNav);
			}
		);
	}

	getAvatar() {
		this.api.getAvatar(this.currentUser._id).subscribe(
			data => {
				let avatar: any;
				avatar = data;
				this.ifuser_avatar = true;
				this.user_avatar = avatar.avatar_path + avatar.avatar_photo;
			}
		)
	}

	logout() {
		this.userService.update(this.currentUser._id, this.update_status.value)
			.pipe(first())
			.subscribe(
				data => {
					this.authService.logout();
					window.location.reload();
				},
				error => { console.log(error) },
				() => {

				}
			);
	}

	selectAvatar(avatar) {
		this.avatar = avatar;
	}

	submitAvatar() {
		let x = this.avatar.split("/");
		this.avatar_pic.value.user_id = this.currentUser._id;
		this.avatar_pic.value.avatar_path = x[0] + '/' + x[1] + '/' + x[2] + '/';
		this.avatar_pic.value.avatar_photo = x[3];
		this.userService.update(this.currentUser._id, this.avatar_pic.value).subscribe(
			data => {
				console.log(data)
			}
		);
		// if(this.ifuser_avatar == false){
		// 	this.api.selectAvatar(this.avatar_pic.value).subscribe(
		// 		data => {
		// 			console.log(data);
		// 		}
		// 	)
		// }
		// else{
		// 	this.api.updateAvatar(this.avatar_pic.value).subscribe(
		// 		data=> {
		// 			console.log('update'+ data);
		// 		}
		// 	)
		// }
	}

	preview(files) {
		if (files.length === 0)
			return;

		var mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			this.message = "Only images are supported.";
			return;
		}

		var reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			this.imgURL = reader.result;
		}
	}

}
