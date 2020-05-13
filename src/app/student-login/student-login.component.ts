import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AuthService } from '../_services';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
declare var $: any;

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {
  loginForm: any;
  submitted = false;
  errorMessage: string;
  successMessage: string;
  incorrect = false;
  update_status: any;
  currentUser: User;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    // redirect to home if already logged in
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
    // this.authService.logout();

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.update_status = this.formBuilder.group({
      status: ['online'],
      status_id: ['1']
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  tryLogin() {
    console.log(this.loginForm.value.email)
    this.submitted = true;
    if (this.loginForm.invalid) {
      // console.log('bihi')
      return;
    }

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(first())
      .subscribe(
        data => {
          // console.log(data);
          this.authService.updateStatus(data._id, this.update_status.value);
        },
        error => {
          if (error) {
            this.incorrect = true;
          }
        });

  }

  update(id) {
    this.userService.update(id, this.update_status.value)
      .pipe(first())
      .subscribe(
        data => {
          // console.log(data)
          this.router.navigate(['/proposals']);
        }
      );
  }

}
