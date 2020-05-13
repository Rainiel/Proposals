import { Component, OnInit } from '@angular/core';
import { GroupService } from '../_services/group.service';
import { ApiService } from '../_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

	group_lists = [];
	subs$: any;
	group_id: any;

	constructor(private groupService: GroupService,
				private api: ApiService,
				private router: Router,
				private route: ActivatedRoute,) { }

	ngOnInit() {
		this.getAllGroups();
		this.subs$ = this.route
		.queryParams
		.subscribe((params) => {
			this.group_id = params["name"];
		});
	}

	getAllGroups(){
		this.groupService.getAll().subscribe(
			data=>{
				// console.log(data);
				this.group_lists = data;
			}
		)
	}

	viewGroupProfile(id){
		this.router.navigate(['/group-profile'], { queryParams: { name: id } });
	}

}
