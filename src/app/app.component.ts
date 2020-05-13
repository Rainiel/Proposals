import { Component } from '@angular/core';
import { ApiService } from './_services/api.service';
import { User } from './_models';
import { AuthService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  	title = 'PAFMS';
	currentUser: any;
	ifRoleStudent = false;
	ifRoleCommittee = false;

    constructor(
        private api: ApiService,
        private authService: AuthService
    ){
		// console.log(authService.currentUserValue);
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		if(authService.currentUserValue != null){
			if(authService.currentUserValue.role == 'Student'){
				this.ifRoleStudent = true;
			}
			if(authService.currentUserValue.role == 'Committee'){
				this.ifRoleCommittee = true;
			}
		}
		else{
			this.ifRoleStudent = false;
			this.ifRoleCommittee = false;
		}
	}
	
}

