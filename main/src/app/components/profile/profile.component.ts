import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../services/profile.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { UserDetailsComponent } from "../user-details/user-details.component";
import { DashboardcComponent } from "../dashboardc/dashboardc.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDetailsComponent, DashboardcComponent],
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

  userId: string = ''; // Get the logged-in user's ID here (e.g., from LocalStorage or an AuthService)
  profileImage: string | ArrayBuffer | null = null;
  errorMessage: string = ''; // For storing error messages

  constructor(private userDataService: UserDataService, private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
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
}