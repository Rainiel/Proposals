import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { jqxDragDropModule } from 'jqwidgets-ng/jqxdragdrop';
import { MaterialModule } from './material-module';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { StudentRegisterComponent } from './student-register/student-register.component';
import { StudentNavigationComponent } from './student-navigation/student-navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommitteeComponent } from './committee/committee.component';
import { CommitteeLoginComponent } from './committee-login/committee-login.component';

import { AuthGuard, JwtInterceptor, ErrorInterceptor, fakeBackendProvider } from './_helpers';
import { AuthService, UserService } from './_services';
import { ViewClassComponent } from './view-class/view-class.component';
import { ApiService } from './_services/api.service';

import { FileSelectDirective } from 'ng2-file-upload';
import { ProposalsComponent } from './proposals/proposals.component';
import { GroupListComponent } from './group-list/group-list.component';
import { CalendarComponent } from './calendar/calendar.component';
import { StudentGroupComponent } from './student-group/student-group.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { DateFormatPipe } from './_pipe/date-format.pipe';
import { DatePipe } from '@angular/common';
import { ProposalsProfileComponent } from './proposals-profile/proposals-profile.component';
import { DefenseScheduleComponent } from './defense-schedule/defense-schedule.component';
import { DefenseSchedulerComponent } from './defense-scheduler/defense-scheduler.component';
import { SectionFilterPipe } from './_pipe/section-filter.pipe';
import { SettingsComponent } from './settings/settings.component';
import { CommitteeNavigationComponent } from './committee-navigation/committee-navigation.component';
import { DateCommentPipe } from './_pipe/date-comment.pipe';
import { ActivityComponent } from './activity/activity.component';
import { DateActivityPipe } from './_pipe/date-activity.pipe';
import { GroupProfileComponent } from './group-profile/group-profile.component';

import { FileUploadModule } from 'ng2-file-upload';
import { GroupsFilterPipe } from './_pipe/groups-filter.pipe';

@NgModule({
  	declarations: [
		AppComponent,
		StudentLoginComponent,
		StudentRegisterComponent,
		StudentNavigationComponent,
		DashboardComponent,
		CommitteeComponent,
		CommitteeLoginComponent,
		ViewClassComponent,
		ProposalsComponent,
		GroupListComponent,
		CalendarComponent,
		StudentGroupComponent,
		FileManagerComponent,
		DateFormatPipe,
		ProposalsProfileComponent,
		DefenseScheduleComponent,
		DefenseSchedulerComponent,
		SectionFilterPipe,
		SettingsComponent,
		CommitteeNavigationComponent,
		DateCommentPipe,
		ActivityComponent,
		DateActivityPipe,
		GroupProfileComponent,
		GroupsFilterPipe
  	],
  	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		jqxGridModule,
		jqxDragDropModule,
		MaterialModule,
		FullCalendarModule,
		FileUploadModule,
		NgMultiSelectDropDownModule.forRoot()
  	],
  	providers: [ 	
	  	AuthGuard,
		AuthService,
		UserService,
		ApiService,
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		DatePipe,
		SectionFilterPipe,
		GroupsFilterPipe

		// provider used to create fake backend
		// fakeBackendProvider,
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
