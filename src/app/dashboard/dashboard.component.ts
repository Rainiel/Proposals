import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../_services/dashboard.service';
import { ApiService } from '../_services/api.service';
import { ActivityService } from '../_services/activity.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  countProposals: any;
  countGroups: any;
  countStudents: any;
  countonlineStudents: any;
  onlineStudents = [];
  sectionList: any;
  countPYS51: any; //count proposal year section 5 1
  countPYS52: any;
  countGYS51: any; //count group year section 5 1
  countGYS52: any;
  countSYS51: any;
  countSYS52: any;

  constructor(private dashboardService: DashboardService,
              private apiService: ApiService) { }

  ngOnInit() {
    this.getProposals();
    this.getGroups();
    this.getStudents();
    this.getSections();
  }

  getProposals(){
    let ys51 = [];
    let ys52 = [];
    this.dashboardService.getProposals().subscribe(
      data=>{
        console.log("proposal",data);
        this.countProposals = data.length;
        for (let i = 0; i < data.length; i++){
          if(data[i].year == '5' && data[i].section == '1'){
            ys51.push(data[i]);
          } else if (data[i].year == '5' && data[i].section == '2'){
            ys52.push(data[i]);
          }
        }
      },
      err=>{},
      ()=>{
        this.countPYS51 = ys51.length;
        this.countPYS52 = ys52.length;
      }
    );
  }

  getGroups(){
    let ys51 = [];
    let ys52 = [];
    this.dashboardService.getGroups().subscribe(
      data=>{
        console.log("groups", data);
        this.countGroups = data.length;
        for (let i = 0; i < data.length; i++){
          if(data[i].year == '5' && data[i].section == '1'){
            ys51.push(data[i]);
          } else if (data[i].year == '5' && data[i].section == '2'){
            ys52.push(data[i]);
          }
        }
      },
      err=>{},
      ()=>{
        this.countGYS51 = ys51.length;
        this.countGYS52 = ys52.length;
      }
    );
  }

  getStudents(){
    let OLstudents = [];
    let ys51 = [];
    let ys52 = [];
    this.dashboardService.getStudents().subscribe(
      data=>{
        console.log("students", data);
        this.countStudents = data.length;
        for (let i = 0; i < data.length; i++){
          if(data[i].status == 'online'){
            OLstudents.push(data[i]);
          }
          if(data[i].year == '5' && data[i].section == '1'){
            ys51.push(data[i]);
          } else if (data[i].year == '5' && data[i].section == '2'){
            ys52.push(data[i]);
          }
        }
      },
      err=>{},
      ()=>{
        this.countonlineStudents = OLstudents.length;
        this.onlineStudents = OLstudents;
        console.log("online student", this.onlineStudents);
        this.countSYS51 = ys51.length;
        this.countSYS52 = ys52.length;
        console.log('students bilang1',ys51);
        console.log('students bilang2',ys52);
      }
    );
  }

  getSections(){
    this.apiService.getSectionList().subscribe(
      data=>{
        console.log("section",data);
        this.sectionList = data;
      }
    );
  }

}
