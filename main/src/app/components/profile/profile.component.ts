import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsComponent } from '../goals/goals.component';
import { PocProjectsComponent } from '../poc-projects/poc-projects.component';
import { LearningPathComponent } from '../learning-path/learning-path.component';
import { FormsModule } from '@angular/forms';
import { MylearnComponent } from '../mylearn/mylearn.component';

import { UserDataService } from '../../services/profile.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule,MylearnComponent],
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
          this.userProfile.role = data.role || 'No role assigned';
        },
        (error) => {
          console.error('Error fetching user profile:', error);
          this.errorMessage = 'Error fetching user profile. Please try again later.';
        }
      );
      
    } else {
      console.error('No user ID found in localStorage. User is not logged in.');
      this.errorMessage = 'No user ID found. Please log in.';
    }
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