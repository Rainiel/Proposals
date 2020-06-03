import { Component, OnInit, ViewChild  } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { DefenseScheduleService } from '../_services/defense-schedule.service';
import { ExcelService } from '../_services/excel.service';
import { EmployeeService } from '../_services/employee.service';
import { GroupService } from '../_services/group.service';
import { AuthService } from '../_services';
declare var $: any;

@Component({
  selector: 'app-defense-schedule',
  templateUrl: './defense-schedule.component.html',
  styleUrls: ['./defense-schedule.component.scss']
})
export class DefenseScheduleComponent implements OnInit {
	schedule_id: any;
	ifSchedule = true;
	monday = [];
	tuesday = [];
	wednesday = [];
	thursday = [];
	friday = [];
	saturday = [];
	mondayExcel = [];
	tuesdayExcel = [];
	wednesdayExcel = [];
	thursdayExcel = [];
	fridayExcel = [];
	saturdayExcel = [];
	employees = [];
	arrays = [
		{monday: this.monday},
		{tuesday: this.tuesday},
		{wednesday: this.wednesday},
		{thursday: this.thursday},
		{friday: this.friday},
		{saturday: this.saturday},
	];
	arrayForExcel = [];
	getLargestArray = [];
	maxLengthOfArray: number = 0;
	panel1: any;
	panel2: any;
	panel3: any;
	ifUserIsStudent:any;
	currentUser: any;
	defense_week: any;

	  constructor(private router: Router,
		private defense_sched: DefenseScheduleService,
		private excelService: ExcelService,
		private authService: AuthService,
		private employeeService: EmployeeService,
		private groupService: GroupService) { }

	ngOnInit() {
		$(document).ready(function(){

			$("#save_proposal_title").click(function(){
				$(".odd").children(".dataTables_empty").remove();
			});

		});
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		if(this.currentUser.role == 'Student'){
			this.ifUserIsStudent = false;
		}else{this.ifUserIsStudent = true;}
		console.log(this.arrays)
		this.getSchedules();
		this.getEmployees();
		this.defense_sched.getWeek().subscribe(
			data=>{
				this.defense_week = data[0].week;
			}
		)
	}

	getEmployees(){
		this.employeeService.getAll().subscribe(
			data=>{
				// console.log(data);
				this.employees = data;
			}
		)
	}

	getSchedules(){
		this.defense_sched.getSchedule().subscribe(
			data=>{
				this.ifSchedule = false;
				this.schedule_id = data[0].id;
				for(let i = 0; i < data[0].monday.length; i++){
					this.monday.push(data[0].monday[i]);
					this.mondayExcel.push(data[0].monday[i].group);
				}
				for(let i = 0; i < data[0].tuesday.length; i++){
					this.tuesday.push(data[0].tuesday[i]);
					this.tuesdayExcel.push(data[0].tuesday[i].group);
				}
				for(let i = 0; i < data[0].wednesday.length; i++){
					this.wednesday.push(data[0].wednesday[i]);
					this.wednesdayExcel.push(data[0].wednesday[i].group);
				}
				for(let i = 0; i < data[0].thursday.length; i++){
					this.thursday.push(data[0].thursday[i]);
					this.thursdayExcel.push(data[0].thursday[i].group);
				}
				for(let i = 0; i < data[0].friday.length; i++){
					this.friday.push(data[0].friday[i]);
					this.fridayExcel.push(data[0].friday[i].group);
				}
				for(let i = 0; i < data[0].saturday.length; i++){
					this.saturday.push(data[0].saturday[i]);
					this.saturdayExcel.push(data[0].saturday[i].group);
				}
			}
		)
	}

	createSchedule(){
		this.router.navigate(['/defense_scheduler']);
	}

	updateSchedule(id){
		this.router.navigate(['/defense_scheduler'], {queryParams: {schedule: id}});
	}

	exportAsXLSX():void {
		this.getLargestArray.push(this.mondayExcel.length);
		this.getLargestArray.push(this.tuesdayExcel.length);
		this.getLargestArray.push(this.wednesdayExcel.length);
		this.getLargestArray.push(this.thursdayExcel.length);
		this.getLargestArray.push(this.fridayExcel.length);
		this.getLargestArray.push(this.saturdayExcel.length);

		this.maxLengthOfArray = this.getLargestArray.reduce((a, b) => Math.max(a, b));
		console.log(this.maxLengthOfArray)
		for(let i=0;i<this.maxLengthOfArray;i++){
			this.arrayForExcel.push(
				{
					Monday: 	this.mondayExcel[i],
					Tuesday: 	this.tuesdayExcel[i],
					Wednesday: 	this.wednesdayExcel[i],
					Thursday: 	this.thursdayExcel[i],
					Friday: 	this.fridayExcel[i],
					Saturday: 	this.saturdayExcel[i]
				}
			);
		}

		this.excelService.exportAsExcelFile(this.arrayForExcel, 'sample');
	}

	openModalAddPanel(group_id){
		console.log(group_id)
		document.getElementById("openModalPanel").click();
		$('#group_id').val(group_id);
		this.groupService.getById(group_id).subscribe(
			data=>{
				if(data.panel1 != 'N/A'){
					this.employeeService.getById(data.panel1).subscribe(
						data=>{
							let object_panel: any;
							object_panel = data;
							this.panel1 = object_panel.whole_name;
						}
					)
				}else{
					this.panel1 = 'N/A';
				}
				if(data.panel2 != 'N/A'){
					this.employeeService.getById(data.panel2).subscribe(
						data=>{
							let object_panel: any;
							object_panel = data;
							this.panel2 = object_panel.whole_name;
						}
					);
				}else{
					this.panel2 = 'N/A';
				}
				if(data.panel3 != 'N/A'){
					this.employeeService.getById(data.panel3).subscribe(
						data=>{
							let object_panel: any;
							object_panel = data;
							this.panel3 = object_panel.whole_name;
						}
					);
				}else{
					this.panel3 = 'N/A';
				}
			}
		);
	}

	selectPanel1(emp){
		console.log(emp)
		var panel = emp.split(',');
		var adviserForm = ({
			panel1: panel[0]
		});
		console.log(adviserForm)
		var group_id = $('#group_id').val();
		this.groupService.update(group_id, adviserForm).subscribe(
			data=>{
				console.log(data)
			}
		);
	}
	selectPanel2(emp){
		console.log(emp)
		var panel = emp.split(',');
		var adviserForm = ({
			panel2: panel[0]
		});
		console.log(adviserForm)
		var group_id = $('#group_id').val();
		this.groupService.update(group_id, adviserForm).subscribe(
			data=>{
				console.log(data)
			}
		);
	}
	selectPanel3(emp){
		console.log(emp)
		var panel = emp.split(',');
		var adviserForm = ({
			panel3: panel[0]
		});
		console.log(adviserForm)
		var group_id = $('#group_id').val();
		this.groupService.update(group_id, adviserForm).subscribe(
			data=>{
				console.log(data)
			}
		);
	}

}
