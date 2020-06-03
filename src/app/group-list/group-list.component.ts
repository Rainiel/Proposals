import { Component, OnInit } from '@angular/core';
import { GroupService } from '../_services/group.service';
import { ApiService } from '../_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services';
import { User } from '../_models';
import { GroupsFilterPipe } from '../_pipe/groups-filter.pipe';


@Component({
	selector: 'app-group-list',
	templateUrl: './group-list.component.html',
	styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

	group_lists = [];
	subs$: any;
	group_id: any;
	currentUser: User;
	isUserStudent: boolean;
	ifRoleStudent: boolean;
	ifRoleCommittee: boolean;
	section_list: any;
	studentSection: any = "";

	constructor(private groupService: GroupService,
		private api: ApiService,
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthService,
		private groupsFilter: GroupsFilterPipe) {
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		if (this.currentUser.role == 'Student') {
			this.isUserStudent = true;
		}
		else {
			this.isUserStudent = false;
		}

		if (authService.currentUserValue != null) {
			if (authService.currentUserValue.role == 'Student') {
				this.ifRoleStudent = true;
				this.getGroupsBySection(this.currentUser.section, this.currentUser.year);
			}
			if (authService.currentUserValue.role == 'Committee') {
				this.ifRoleCommittee = true;
				// this.getAllUsers();k
				this.getAllGroups();
				this.getSectionList();
			}
		}
		else {
			this.ifRoleStudent = false;
			this.ifRoleCommittee = false;
		}
	}

	ngOnInit() {
		this.subs$ = this.route
			.queryParams
			.subscribe((params) => {
				this.group_id = params["name"];
			});
		// if (this.isUserStudent == true) {
			
		// } else {
		// 	this.getAllGroups();
		// }
	}

	getSectionList() {
		this.api.getSectionList().subscribe(
			data => {
				this.section_list = data;
				// console.log(data)
			}
		)
	}

	getAllGroups() {
		this.groupService.getAll().subscribe(
			data => {
				// console.log(data);
				this.group_lists = data;
			}
		)
	}

	getGroupsBySection(section, year) {
		this.groupService.getGroupsBySection(section, year).subscribe(
			data => {
				this.group_lists = data;
				console.log(data)
			}
		);
	}

	viewGroupProfile(id) {
		this.router.navigate(['/group-profile'], { queryParams: { name: id } });
	}

}
