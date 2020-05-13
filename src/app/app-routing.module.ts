import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentLoginComponent } from './student-login/student-login.component';
import { StudentRegisterComponent } from './student-register/student-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './_helpers/auth.guard';
import { CommitteeComponent } from './committee/committee.component';
import { CommitteeLoginComponent } from './committee-login/committee-login.component';
import { ViewClassComponent } from './view-class/view-class.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { GroupListComponent } from './group-list/group-list.component';
import { CalendarComponent } from './calendar/calendar.component';
import { StudentGroupComponent } from './student-group/student-group.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { ProposalsProfileComponent } from './proposals-profile/proposals-profile.component';
import { DefenseScheduleComponent } from './defense-schedule/defense-schedule.component';
import { DefenseSchedulerComponent } from './defense-scheduler/defense-scheduler.component';
import { SettingsComponent } from './settings/settings.component';
import { ActivityComponent } from './activity/activity.component';
import { GroupProfileComponent } from './group-profile/group-profile.component';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: StudentLoginComponent},
	{ path: 'register', component: StudentRegisterComponent},
	{ path: 'login/employee', component: CommitteeLoginComponent},

	//PAGES
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
	{ path: 'proposals', component: ProposalsComponent, canActivate: [AuthGuard]},
	{ path: 'proposal-profile', component: ProposalsProfileComponent, canActivate: [AuthGuard]},
	{ path: 'view_class', component: ViewClassComponent, canActivate: [AuthGuard]},
	{ path: 'group_list', component: GroupListComponent, canActivate: [AuthGuard]},
	{ path: 'group-profile', component: GroupProfileComponent, canActivate: [AuthGuard]},
	{ path: 'committee', component: CommitteeComponent, canActivate: [AuthGuard]},
	{ path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]},
	{ path: 'group', component: StudentGroupComponent, canActivate: [AuthGuard]},
	{ path: 'file_explorer', component: FileManagerComponent, canActivate: [AuthGuard]},
	{ path: 'defense_schedule', component: DefenseScheduleComponent, canActivate: [AuthGuard]},
	{ path: 'defense_scheduler', component: DefenseSchedulerComponent, canActivate: [AuthGuard]},
	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
	{ path: 'activity', component: ActivityComponent, canActivate: [AuthGuard]}
	
  	// otherwise redirect to home
	//   { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
