import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../_models';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  currentUser: User;
  url = 'http://localhost:4000';
  observable: Observable<string>;
  socket;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.socket = io(this.url);
  }

  create(activity) {
		return this.http.post<any>(`${this.url}/activity/create`, activity);
  }
  
  getActivityStudents(year, section, batch_year, batch_sem, group_id){
    return this.http.get<any>(`${this.url}/activity/getActivityStudents/${year}/${section}/${batch_year}/${batch_sem}/${group_id}`);
  }

  getAllActivity(){
    return this.http.get<any>(`${this.url}/activity/getAllActivity`);
  }

}
