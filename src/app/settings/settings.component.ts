import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { UserService } from '../_services';
import { EmployeeService } from '../_services/employee.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as io from 'socket.io-client';
declare var $: any;

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	private userSubscription: Subscription[] = [];
	sections = [];
	employees = [];
	isAssigned = false;
	userNavigation = [];
	employeeNavigation = [];
	yearAndSectionForm: any;

	//-----For Realtime--------------
	socket;
	url = 'http://localhost:4000';
	currentBatchForm: any;
	batchYear: any;
	batchSem: any;
	//-----For Realtime--------------

	constructor(private api: ApiService,
		private userService: UserService,
		private employeeService: EmployeeService,
		private formBuilder: FormBuilder) {
		//-----For Realtime--------------
		this.socket = io(this.url);
		this.userSubscription.push(
			this.api.getSectionListData().subscribe(() => {
				this.getSections();
			})
		);
		//-----For Realtime--------------
	}

	ngOnInit() {
		this.getSections();
		this.getEmployees();
		this.getUserNavigation();
		this.getEmployeeNavigation();
		this.getCurrentBatch();

		this.yearAndSectionForm = this.formBuilder.group({
			year: [''],
			section: [''],
			color: ['#ffffff'],
			adviser_id: ['N/A'],
			adviser_whole_name: ['N/A']
		});

		this.currentBatchForm = this.formBuilder.group({
			batch_year: [''],
			batch_sem: ['']
		});
	}

	getCurrentBatch() {
		this.api.getCurrentBatch().subscribe(
			data => {
				console.log(data)
				this.batchYear = data[0].batch_year;
				this.batchSem = data[0].batch_sem;
			}
		)
	}

	getSections() {
		this.api.getSectionList().subscribe(
			data => {
				console.log(data)
				this.sections = data;
			}
		)
	}

	getEmployees() {
		this.employeeService.getAll().subscribe(
			data => {
				this.employees = data;
			}
		)
	}

	getUserNavigation() {
		this.api.getUserNavigation().subscribe(
			data => {
				console.log(data)
				this.userNavigation = data;
			}
		)
	}

	getEmployeeNavigation() {
		this.api.getEmployeeNavigation().subscribe(
			data => {
				console.log(data)
				this.employeeNavigation = data;
			}
		)
	}

	openInputColorSection(section_id) {
		$('#section_id').val(section_id);
		document.getElementById("buttonColorSection").click();
	}

	inputColorSection() {
		var colorSection = $('#color').val();
		var section_id = $('#section_id').val();
		var colorSectionForm = ({
			color: colorSection
		});
		this.api.updateColorSection(section_id, colorSectionForm).subscribe(
			data => {
				console.log(data)
			}
		)
	}

	selectAdviser(emp_id) {
		var adviser = emp_id.split(',');
		console.log(adviser)
		var adviserForm = ({
			adviser_id: adviser[0],
			adviser_whole_name: adviser[2] + ' ' + adviser[3]
		});
		this.api.sectionAdviser(adviser[1], adviserForm).subscribe(
			data => {
				if (data == "ERROR") {
					this.isAssigned = true;
				}
			}
		)
	}

	checkboxUserNav(unav_id, show_hide) {
		console.log(unav_id, show_hide);
		var boolean = ({ boolean: show_hide });
		this.api.userNavigation(unav_id, boolean).subscribe(
			data => {
				console.log(data)
			}
		)
	}

	checkboxEmploeeNav(unav_id, show_hide) {
		console.log(unav_id, show_hide);
		var boolean = ({ boolean: show_hide });
		this.api.employeeNavigation(unav_id, boolean).subscribe(
			data => {
				console.log(data)
			}
		)
	}

	createYearAndSection() {
		var year = $('#year').val();
		var section = $('#section').val();
		this.yearAndSectionForm.value.year = year;
		this.yearAndSectionForm.value.section = section;
		this.api.createYearAndSection(this.yearAndSectionForm.value).subscribe(
			data => {
			}
		)
	}

	updateCurrentBatch() {
		let batch_year = $('#batch_year').val();
		let batch_sem = $('#batch_sem').val();
		this.currentBatchForm.value.batch_year = batch_year;
		this.currentBatchForm.value.batch_sem = batch_sem;
		this.api.updateCurrentBatch(this.currentBatchForm.value).subscribe(
			data => {
			}
		);
	}
}
