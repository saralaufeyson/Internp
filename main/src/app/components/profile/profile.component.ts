import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../services/profile.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { PocService } from 'src/app/services/poc.service';
import { UserDetailsComponent } from "../user-details/user-details.component";
import { PocProjectsComponent } from '../poc-projects/poc-projects.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDetailsComponent, PocProjectsComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {
    name: '',
    email: '',
    status: '',
    joinedDate: '',
    role: ''
  };

  userId: string = '';
  errorMessage: string = '';
  pocs: Array<any> = [];

  constructor(
    private userDataService: UserDataService,
    private http: HttpClient,
    private userService: UserService,
    private pocService: PocService
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';

    if (this.userId) {
      this.userService.getUserProfile(this.userId).subscribe(
        (data) => {
          this.userProfile = data;
          this.userProfile.role = data.role || 'No role assigned';
        },
        (error) => {
          console.error('Error fetching user profile:', error);
          this.errorMessage = 'Error fetching user profile. Please try again later.';
        }
      );

      this.loadPocProjects();
    } else {
      console.error('No user ID found in localStorage. User is not logged in.');
      this.errorMessage = 'No user ID found. Please log in.';
    }
  }

  loadPocProjects() {
    this.pocService.getPocProjects(this.userId).subscribe(
      (response: any) => {
        console.log("PoC Projects fetched:", response);
        this.pocs = response || [];
      },
      (error) => {
        console.error('Error fetching PoC Projects', error);
      }
    );
  }
}
