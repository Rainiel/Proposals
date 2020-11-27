import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { first } from 'rxjs/operators';
import { EmployeeService } from '../_services/employee.service';
import { AuthService } from '../_services';

@Component({
	selector: 'app-committee',
	templateUrl: './committee.component.html',
	styleUrls: ['./committee.component.scss']
})
export class CommitteeComponent implements OnInit {
	registerForm: FormGroup;
	submitted = false;
	committees: any;
	ifUserIsStudent: any;
	currentUser: any;

	constructor(
		private api: ApiService,
		private formBuilder: FormBuilder,
		private employeeService: EmployeeService,
		private authService: AuthService,
	) {
		this.getCommittee();
	}

	ngOnInit() {
		this.registerForm = this.formBuilder.group({
			title: [''],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			whole_name: [''],
			avatar_path: ['assets/img/Avatars/'],
			avatar_photo: ['unknown_avatar.png'],
			status: ['offline'],
			role: ['Committee'],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(3)]],
			confirmPassword: ['', Validators.required]
		}, {
			validator: this.api.MustMatch('password', 'confirmPassword')
		});

		this.authService.currentUser.subscribe(x => this.currentUser = x);
		if (this.currentUser.role == 'Student') {
			this.ifUserIsStudent = false;
		} else { this.ifUserIsStudent = true; }
	}
	// convenience getter for easy access to form fields
	get f() { return this.registerForm.controls; }

	tryRegisterCommittee() {
		this.submitted = true;
		if (this.registerForm.invalid) {
			return;
		}
		else if (this.registerForm.value.password == this.registerForm.value.confirmPassword) {
			this.registerForm.value.whole_name = this.registerForm.value.firstName + ' ' + this.registerForm.value.lastName;
			this.employeeService.register(this.registerForm.value)
				.pipe(first())
				.subscribe(
					data => {
						console.log("Employee Created")
					},
					error => {
						console.log(error)
					},
					() => {
						window.location.reload();
					});
		}
	}

	getCommittee() {
		this.employeeService.getAll().subscribe(
			data => {
				this.committees = data;
			}
		)
	}
}
