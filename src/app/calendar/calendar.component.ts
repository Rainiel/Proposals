import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FormBuilder } from '@angular/forms';
import { CalendarService } from '../_services/calendar.service';
import { AuthService } from '../_services';
declare var $: any;

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
	// @ViewChild('calendaryo') calendarComponent: FullCalendarComponent; // the #calendar in the template
	id = 0;
	calendarVisible = true;
	calendarPlugins = [dayGridPlugin, timeGrigPlugin, listPlugin, interactionPlugin];
	calendarWeekends = true;
	calendarEvents = [];
	calendarForm: any;
	startValue: any;
	currentUser: any;
	ifUserIsStudent: any;
	constructor(private formBuilder: FormBuilder,
		private calendarService: CalendarService,
		private authService: AuthService, ) {
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		if (this.currentUser.role == 'Student') {
			this.ifUserIsStudent = false;
		} else { this.ifUserIsStudent = true; }
	}

	ngOnInit() {
		this.getEvents();
		this.calendarForm = this.formBuilder.group({
			title: [''],
			start: [''],
			end: [''],
			editable: true,
			durationEditable: true,
			allDay: true
		});
	}

	toggleVisible() {
		this.calendarVisible = !this.calendarVisible;
	}

	toggleWeekends() {
		this.calendarWeekends = !this.calendarWeekends;
	}

	eventClick(e) {
		console.log(e.event._calendar.component.uid)
		// var indexNum = this.calendarEvents.findIndex((element)=> {
		// 	return (element.id == 0);
		//   });
		// console.log(indexNum)
	}

	eventDrop(e) {
		console.log(e.event)
		this.calendarForm.value.title = e.event.title;
		this.calendarForm.value.start = e.event.start;
		this.calendarForm.value.end = e.event.end;
		this.calendarService.update(e.event.id, this.calendarForm.value).subscribe(
			data => {
				// console.log(data)
			}
		);
	}

	eventResize(e) {
		console.log(e.event)
		this.calendarForm.value.title = e.event.title;
		this.calendarForm.value.start = e.event.start;
		this.calendarForm.value.end = e.event.end;
		this.calendarService.update(e.event.id, this.calendarForm.value).subscribe(
			data => {
				// console.log(data)
			}
		)
	}

	handleDateClick(arg) {
		$("#calendarModal").modal('show');
		this.startValue = arg.dateStr;
		//   if (confirm('Would you like to add an event to ' + arg.dateStr + ' Plus Ultra: ' +arg.date +' ?')) {
		// 	  	this.id + 1;
		// 	this.calendarEvents.push({ // add new event data. must create new array
		// 		id: this.id,
		// 		title: 'New Event',
		// 		start: arg.dateStr,
		// 		editable: true,
		// 		durationEditable: true,
		// 		allDay: true
		// 	})
		//   }
	}

	getEvents() {
		this.calendarService.getAll().subscribe(
			data => {
				// console.log(data)
				for (let i = 0; i < data.length; i++) {
					this.calendarEvents.push({
						id: data[i].id,
						title: data[i].title,
						start: data[i].start,
						end: data[i].end,
						editable: data[i].editable,
						durationEditable: data[i].durationEditable,
						allDay: data[i].allDay
					})
				}
			}
		)
	}

	createEvent() {
		this.calendarService.create(this.calendarForm.value).subscribe(
			data => {
				// console.log(data)
				this.calendarEvents.push({
					id: data.id,
					title: data.title,
					start: data.start,
					end: data.end,
					editable: data.editable,
					durationEditable: data.durationEditable,
					allDay: data.allDay
				});
				$("#calendarModal").modal('hide');
			}
		)
	}
}
