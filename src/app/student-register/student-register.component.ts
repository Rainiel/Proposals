import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { UserService, AuthService } from '../_services'

declare var $: any;

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.scss']
})
export class StudentRegisterComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  registerForm: FormGroup;
  submitted = false;
  whole_name: any;
  register: FormGroup;
  years: any[];
  sections: any[];

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
    // console.log(this.authService.currentUserValue)
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

    this.getYearAndSec();
    this.getCurrentBatch();

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      confirmPassword: ['', Validators.required],
      whole_name: [''],
      role: ['Student'],
      status: ['offline'],
      avatar_path: ['assets/img/Avatars/'],
      avatar_photo: ['unknown_avatar.png'],
      group_proposal_id: [null],
      created_batch_year: [''],
      created_batch_sem: [''],
      year: [''],
      section: ['']
    }, {
      validator: this.api.MustMatch('password', 'confirmPassword')
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  tryRegister() {
    this.submitted = true;
    this.registerForm.value.whole_name = this.registerForm.value.firstName + ' ' + this.registerForm.value.lastName;
    this.api.getCurrentBatch().subscribe(
      data => {
        this.registerForm.value.created_batch_year = data[0].batch_year;
        this.registerForm.value.created_batch_sem = data[0].batch_sem;
        console.log(this.registerForm.value.created_batch_year)
        if (this.registerForm.invalid) {
          return;
        }
        else if (this.registerForm.value.password == this.registerForm.value.confirmPassword) {
          this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
              data => {
                this.router.navigate(['/login']);
              },
              error => {
                console.log(error)
              });
        }
      }
    );
  }

  getYearAndSec() {
    let years = [];
    let sections = [];
    this.api.getSectionList().subscribe(
      data => {
        console.log(data)
        for (let i: number = 0; i < data.length; i++) {
          years.push(data[i].year);
          sections.push(data[i].section);
        }
      }, err => { },
      () => {
        let uniqueYears = years.filter((item, index) => {
          return years.indexOf(item) == index;
        });
        let uniqueSections = sections.filter((item, index) => {
          return sections.indexOf(item) == index;
        })
        this.years = uniqueYears.sort((n1, n2) => n1 - n2);
        this.sections = uniqueSections.sort((n1, n2) => n1 - n2);
      }
    )
  }

  getCurrentBatch() {

  }

}
