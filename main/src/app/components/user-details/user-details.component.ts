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
    btechCgpa: '', // Ensure this field is correctly defined
  };
  isEditMode: boolean = false;
  userId: string = ''; // This will be retrieved from localStorage or route parameter

  constructor(private userDetailsService: UserDetailsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    
    this.userDetailsService.getUserDetails(this.userId).subscribe(
      (data) => {
        console.log('Fetched User Details:', data);  // Log the response from the backend
        this.userDetails = data;
        console.log('Updated userDetails:', this.userDetails); // Log updated userDetails
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
