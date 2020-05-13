import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { EmployeeService } from '../_services/employee.service';
declare var $: any;

@Component({
	selector: 'app-committee-login',
	templateUrl: './committee-login.component.html',
	styleUrls: ['./committee-login.component.scss']
})
export class CommitteeLoginComponent implements OnInit {
	loginForm: any;
	submitted = false;
	incorrect = false;
	update_status: any;

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private employeeService: EmployeeService

	) {
		// redirect to home if already logged insdas
		if (this.authService.currentUserValue) {
			this.router.navigate(['/proposals']);
		}
	}

	ngOnInit() {
		$(document).ready(function () {
			$('.page-center').matchHeight({
				target: $('html')
			});

			$(window).resize(function () {
				setTimeout(function () {
					$('.page-center').matchHeight({ remove: true });
					$('.page-center').matchHeight({
						target: $('html')
					});
				}, 100);
			});
		});

		// reset login status
		this.authService.logoutEmployee();

		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(3)]]
		});

		this.update_status = this.formBuilder.group({
			status: ['online']
		});
	}
	// convenience getter for easy access to form fields
	get f() { return this.loginForm.controls; }

	tryLogin() {
		console.log(this.loginForm.value.email)
		this.submitted = true;
		if (this.loginForm.invalid) {
			return;
		}

		this.authService.loginEmployee(this.loginForm.value.email, this.loginForm.value.password)
			.pipe(first())
			.subscribe(
				data => {
					this.authService.updateStatus(data._id, this.update_status.value);
				},
				error => {
					if (error) {
						this.incorrect = true;
					}
				},
				() => {
					window.location.reload();
				});

	}

	update(id) {
		this.employeeService.update(id, this.update_status.value)
			.pipe(first())
			.subscribe(
				data => {
					// console.log(data)
					this.router.navigate(['/proposals']);
				}
			);
	}

}
