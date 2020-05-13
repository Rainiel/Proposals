import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services';
import { ApiService } from '../_services/api.service';
import { GroupService } from '../_services/group.service';

@Component({
  selector: 'app-student-group',
  templateUrl: './student-group.component.html',
  styleUrls: ['./student-group.component.scss']
})
export class StudentGroupComponent implements OnInit {
	currentUser: any;
	groupMembers: any;
	section_list = [];

	constructor(private authService: AuthService,
		private api: ApiService,
		private groupService: GroupService) { 
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		this.getProposalGroup();
		
	}

	ngOnInit() {

	}



	getProposalGroup(){
		this.groupService.getProposalGroup(this.currentUser.group_proposal_name).subscribe(
			data => {
				// console.log(data)
				for(let i = 0; i<data.length;i++){
					if(data[i].subject == 'Design_Project'){
						this.groupMembers = data[i].groupMembers;
						// console.log(this.groupMembers);
					}
				} 
			}
		)
	}

}
