import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../_services/group.service';
import { EmployeeService } from '../_services/employee.service';

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  styleUrls: ['./group-profile.component.scss']
})
export class GroupProfileComponent implements OnInit {
  subs$: any;
  group_id: any;
  panel1: any;
  panel2: any;
  panel3: any;
  group_name: any;
  group_type: any;
  section: any;
  year: any;
  group_members = [];

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private employeeService: EmployeeService
  ) { 
    this.subs$ = this.route
    .queryParams
    .subscribe((params) => {
      this.group_id = params["name"];
    });
  }

  ngOnInit() {
    this.groupService.getById(this.group_id).subscribe(
      data=>{
        this.group_members = data.groupMembers;
        this.group_name = data.groupName;
        this.group_type = data.groupType;
        this.panel1 = data.panel1;
        this.panel2 = data.panel2;
        this.panel3 = data.panel3;
        this.section = data.section;
        this.year = data.year;

        if(this.group_type == 2){
          this.group_type = 'Software';
        } else {
          this.group_type = 'Hardware';
        }

        this.employeeService.getById(this.panel1).subscribe(
          data=>{
            this.panel1 = data.title + data.firstName + " " + data.lastName;
          }
        );
        this.employeeService.getById(this.panel2).subscribe(
          data=>{
            this.panel2 = data.title + data.firstName + " " + data.lastName;
          }
        );
        this.employeeService.getById(this.panel3).subscribe(
          data=>{
            this.panel3 = data.title + data.firstName + " " + data.lastName;
          }
        );
      }
    )
  }

}
