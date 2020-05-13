import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder } from '@angular/forms';
import { DefenseScheduleService } from '../_services/defense-schedule.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../_services/group.service';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-defense-scheduler',
  templateUrl: './defense-scheduler.component.html',
  styleUrls: ['./defense-scheduler.component.scss']
})
export class DefenseSchedulerComponent implements OnInit {
	subs$;
	schedule_id: any;
	monday = [];
	tuesday = [];
	wednesday = [];
	thursday = [];
	friday = [];
	saturday = [];
	week = [
		this.monday,
		this.tuesday,
		this.wednesday,
		this.thursday,
		this.friday,
		this.saturday
	]
	Groups = [];
	GroupsNotPush = [];
	schedule: any;
	ifSchedule = true;

	constructor(
		private formBuilder: FormBuilder,
		private defense_scheduleService: DefenseScheduleService,
		private defense_sched: DefenseScheduleService,
		private route: ActivatedRoute,
		private groupService: GroupService,
		private api: ApiService,
		private router: Router) { }

	ngOnInit() {
		this.subs$ = this.route
        .queryParams
        .subscribe((params) => {
			this.schedule_id = params["schedule"];
		});
		this.getSchedule();
		this.schedule = this.formBuilder.group({
			monday: [this.monday],
			tuesday: [this.tuesday],
			wednesday: [this.wednesday],
			thursday: [this.thursday],
			friday: [this.friday],
			saturday: [this.saturday]
		});
	}

	getSchedule(){
		if(this.schedule_id){
			this.defense_sched.getSchedule().subscribe(
				data=>{
					this.ifSchedule = false;
					for(let i = 0; i < data[0].monday.length; i++){
						this.monday.push(data[0].monday[i]);
						this.GroupsNotPush.push(data[0].monday[i]);
					}
					for(let i = 0; i < data[0].tuesday.length; i++){
						this.tuesday.push(data[0].tuesday[i]);
						this.GroupsNotPush.push(data[0].tuesday[i]);
					}
					for(let i = 0; i < data[0].wednesday.length; i++){
						this.wednesday.push(data[0].wednesday[i]);
						this.GroupsNotPush.push(data[0].wednesday[i]);
					}
					for(let i = 0; i < data[0].thursday.length; i++){
						this.thursday.push(data[0].thursday[i]);
						this.GroupsNotPush.push(data[0].thursday[i]);
					}
					for(let i = 0; i < data[0].friday.length; i++){
						this.friday.push(data[0].friday[i]);
						this.GroupsNotPush.push(data[0].friday[i]);
					}
					for(let i = 0; i < data[0].saturday.length; i++){
						this.saturday.push(data[0].saturday[i]);
						this.GroupsNotPush.push(data[0].saturday[i]);
					}
					this.getGroups();
				}
			)
		}
	}

	getGroups(){
		this.groupService.getAll().subscribe(
			data=>{
				for(let i = 0; i < data.length; i++){
					this.api.getSectionColor2(data[i].year, data[i].section, data[i].groupName, data[i]._id).subscribe(
						data=>{
							console.log(data)
							this.Groups.push(data);
							this.removeArrayItem(data);
							console.log(this.Groups)
						}
					)
				}
			}
		)
	}

	removeArrayItem(data){
		console.log(this.Groups)
		for(let k = 0; k<this.GroupsNotPush.length; k++){
			console.log(this.GroupsNotPush[k].group)
				if(this.GroupsNotPush[k].group == data.group){
					this.Groups.splice(this.Groups.indexOf(data.group), 1);
				}
		}
	}

	createSchedule(){
		this.defense_scheduleService.create(this.schedule.value).subscribe(
			data => {
				console.log(data)
			}
		)
	}

	updateSchedule(){
		this.defense_scheduleService.update(this.schedule_id, this.schedule.value).subscribe(
			data => {
				console.log(data)
				this.router.navigate(['/defense_schedule']);
			}
		)
	}

  	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
		moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
		transferArrayItem(event.previousContainer.data,
							event.container.data,
							event.previousIndex,
							event.currentIndex);	
		}
  }

}
