import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { UserDataService } from '../../services/profile.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,  FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {
    name: '',
    email: '',
    status: '',
    joinedDate: '',
    role: '' // Add role property
  };

  goals: any[] = [];
  pocProjects: any[] = [];
  learningPaths: any[] = [];

  profileImage: string | ArrayBuffer | null = null;
  userId: string = ''; // Get the logged-in user's ID here (e.g., from LocalStorage or an AuthService)
  errorMessage: string = ''; // For storing error messages

  constructor(private userDataService: UserDataService, private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    // Get the logged-in user's ID (replace with your actual logic to get the user ID)
    this.userId = localStorage.getItem('userId') || ''; // Assume the user ID is saved in localStorage

    // Check if userId is available, if not, log an error or handle the missing user ID scenario
    if (this.userId) {
      this.userService.getUserProfile(this.userId).subscribe(
        (data) => {
          this.userProfile = data;
          // Ensure role is fetched and assigned
          this.userProfile.role = data.role || '';
        },
        (error) => {
          console.error('Error fetching user profile:', error);
          this.errorMessage = 'Error fetching user profile. Please try again later.';
        }
      );
      this.fetchGoals(this.userId);
      this.fetchPocProjects(this.userId);
      this.fetchLearningPaths(this.userId);
    } else {
      console.error('No user ID found in localStorage. User is not logged in.');
      this.errorMessage = 'No user ID found. Please log in.';
    }
  }

  // Fetch user goals
  fetchGoals(userId: string): void {
    this.http.get(`http://localhost:5180/api/userdata/getGoals/${userId}`)
      .subscribe(
        (data: any) => {
          this.goals = data || [];
        },
        (error) => {
          console.error('Error fetching goals:', error);
          this.errorMessage = 'Error fetching goals. Please try again later.';
        }
      );
  }

  // Fetch user PoC projects
  fetchPocProjects(userId: string): void {
    this.http.get(`http://localhost:5180/api/userdata/getPocProjects/${userId}`)
      .subscribe(
        (data: any) => {
          this.pocProjects = data || [];
        },
        (error) => {
          console.error('Error fetching PoC projects:', error);
          this.errorMessage = 'Error fetching PoC projects. Please try again later.';
        }
      );
  }

  // Fetch user learning paths
  fetchLearningPaths(userId: string): void {
    this.http.get(`http://localhost:5180/api/userdata/getLearningPaths/${userId}`)
      .subscribe(
        (data: any) => {
          this.learningPaths = data || [];
        },
        (error) => {
          console.error('Error fetching learning paths:', error);
          this.errorMessage = 'Error fetching learning paths. Please try again later.';
        }
      );
  }

  // Handle profile image upload
  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}