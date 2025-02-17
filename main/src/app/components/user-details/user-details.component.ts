import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from '../../services/user-details.service'; // Make sure to import your service
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userDetails: any = {
    phoneNumber: '',
    email: '',
    address: '',
    tenthGrade: '',
    twelfthGrade: '',
    btechCgpa: ''
  };
  isEditMode: boolean = false;
  userId: string = ''; // This will be retrieved from localStorage or route parameter

  constructor(private userDetailsService: UserDetailsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Assuming userId is stored in localStorage
    this.userId = localStorage.getItem('userId') || '';
    
    // Fetch user details from the backend on component load
    this.userDetailsService.getUserDetails(this.userId).subscribe(
      (data) => {
        this.userDetails = data;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  // To enable the form for editing
  editUserDetails() {
    this.isEditMode = true;
  }

  // To cancel the editing and return to viewing mode
  cancelEdit() {
    this.isEditMode = false;
  }

  // Save the updated user details
  saveUserDetails() {
    this.userDetailsService.updateUserDetails(this.userId, this.userDetails).subscribe({
      next: (response) => {
        console.log('User details updated successfully:', response);
        // Exit edit mode after successful update
        this.isEditMode = false; // Switch back to view mode
      },
      error: (error) => {
        console.error('Error updating user details:', error);
      },
    });
  }
  
  
}
