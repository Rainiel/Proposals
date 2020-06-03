import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../_services/activity.service';
import { User } from '../_models';
import { AuthService, UserService } from '../_services';

@Component({
	selector: 'app-activity',
	templateUrl: './activity.component.html',
	styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
	currentUser: User;
	activities: any;

	constructor(
		private activityService: ActivityService,
		private authService: AuthService,
		private userService: UserService
	) {
		this.authService.currentUser.subscribe(x => this.currentUser = x);
	}

	ngOnInit() {
		if (this.currentUser.role == 'Student') {
			this.getActivityStudents();
		}
		else {
			this.getAllActivities();
		}
	}

	getActivityStudents() {
		let activities = [];
		this.activityService.getActivityStudents(this.currentUser.year, this.currentUser.section, this.currentUser.created_batch_year, this.currentUser.created_batch_sem, this.currentUser.group_proposal_id).subscribe(
			data => {
				for (let i = 0; i < data.length; i++) {
					this.userService.getById(data[i].user_id).subscribe(
						user => {
							activities.push({ ...user, ...data[i] });
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

	getAllActivities() {
		let activities = [];
		this.activityService.getAllActivity().subscribe(
			data => {
				for (let i = 0; i < data.length; i++) {
					this.userService.getById(data[i].user_id).subscribe(
						user => {
							activities.push({ ...user, ...data[i] });
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


}
