import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { UserService, AuthService } from '../_services';
import { FormBuilder } from '@angular/forms';
import { first } from 'rxjs/internal/operators/first';
import { EmployeeService } from '../_services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-committee-navigation',
  templateUrl: './committee-navigation.component.html',
  styleUrls: ['./committee-navigation.component.scss']
})
export class CommitteeNavigationComponent implements OnInit {
	navigations = [];
	currentUser: any;
	update_status: any;
	avatar: any;
	user_avatar: any;
	ifuser_avatar: any;
	avatar_pic: any;

	constructor(private api: ApiService,
		private userService: UserService,
		private employeeService: EmployeeService,
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private router: Router
		) 
		{
			this.update_status = this.formBuilder.group({
				status: ['offline']
			});

			this.avatar_pic = this.formBuilder.group({
				avatar_photo: [''],
				avatar_path: [''],
			});
		}

	ngOnInit() {
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		this.getEmployeeNavigation();
		this.getAvatar();
		this.api.loadScript("../../assets/sidebar/js/main.js");
	}

	getEmployeeNavigation(){
		this.api.getEmployeeNavigation().subscribe(
			data => {
				// console.log(data);
				for(let i = 0;i<data.length;i++){
					// this.navigations.push(data[i]);
					if(data[i].boolean == true){
						this.navigations.push(data[i]);
					}
					for(let k=0;k<data[i].notification.length;k++){
						// console.log(data[i].notification)
					}
				}
				// console.log(this.navigations);
				// console.log(this.withChildNav);
			}
		)
	}

	getAvatar(){
		this.api.getAvatarCommittee(this.currentUser._id).subscribe(
			data=>{
				let avatar: any;
				avatar = data;
				this.ifuser_avatar = true;
				this.user_avatar = avatar.avatar_path + avatar.avatar_photo;
			}
		)
	}

	selectAvatar(avatar){
		this.avatar = avatar;
	}

	submitAvatar(){
		let x = this.avatar.split("/");
		this.avatar_pic.value.user_id = this.currentUser._id;
		this.avatar_pic.value.avatar_path = x[0]+'/'+x[1]+'/'+x[2]+'/';
		this.avatar_pic.value.avatar_photo = x[3];
		this.employeeService.update(this.currentUser._id, this.avatar_pic.value).subscribe(
			data=> {
				console.log(data)
			}
		)
	}

	logout(){
		this.employeeService.update(this.currentUser._id, this.update_status.value)
		.pipe(first())
		.subscribe(
			data => {
				this.authService.logoutEmployee();
			},
			error => {console.log(error)},
			() => {
				window.location.reload();
			}
		);
	}

}
