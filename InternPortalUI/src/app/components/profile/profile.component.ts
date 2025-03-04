import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../services/profile.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { PocService } from 'src/app/services/poc.service';
import { UserDetailsComponent } from "./user-details/user-details.component";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ExperienceComponent } from "./experience/experience.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDetailsComponent, ExperienceComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {
    name: '',
    email: '',
    status: '',
    joinedDate: '',
    role: '',
    about: '' // Initialize about field
  };

  userId: string = ''; // Get the logged-in user's ID here (e.g., from LocalStorage or an AuthService)
  profileImage: SafeUrl | null = null;
  selectedFile: File | null = null;
  errorMessage: string = ''; // For storing error messages
  notificationMessage: string = ''; // For storing notification messages
  isUploading: boolean = false;
  isUploaded: boolean = false;
  pocs: Array<any> = [];
  activeTab: string = 'about'; // Track the active tab

  constructor(
    private userDataService: UserDataService,
    private http: HttpClient,
    private userService: UserService, private sanitizer: DomSanitizer,
    private pocService: PocService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';


    if (this.userId) {
      this.userService.getUserProfile(this.userId).subscribe(
        (data) => {
          this.userProfile = data;
          console.log('User Name:', this.userProfile.name);

          this.userProfile.role = data.role || 'No role assigned';
          this.loadAboutSection(); // Ensure loadAboutSection is called after userProfile is set

        },
        (error) => {
          console.error('Error fetching user profile:', error);
          this.errorMessage = 'Error fetching user profile. Please try again later.';
        }
      );

      this.loadProfileImage();


    } else {
      console.error('No user ID found in localStorage. User is not logged in.');
      this.errorMessage = 'No user ID found. Please log in.';
    }
  }

  loadProfileImage(): void {
    this.http.get(`http://localhost:5180/api/user/getProfileImage/${this.userId}`, { responseType: 'blob' })
      .subscribe(
        (response) => {
          const url = URL.createObjectURL(response);
          this.profileImage = this.sanitizer.bypassSecurityTrustUrl(url);
        },
        (error) => {
          console.error('Error fetching profile image:', error);
          this.profileImage = null; // Ensure profileImage is null if there's an error
        }
      );
  }

  loadAboutSection(): void {
    this.http.get(`http://localhost:5180/api/user/getAboutSection/${this.userId}`, { responseType: 'text' })
      .subscribe(
        (response) => {
          try {
            const parsedResponse = JSON.parse(response);
            this.userProfile.about = parsedResponse.about;
          } catch (error) {
            console.error('Error parsing about section response:', error);
            this.errorMessage = 'Error parsing about section. Please try again later.';
          }
        },
        (error) => {
          console.error('Error fetching about section:', error);
          this.errorMessage = 'Error fetching about section. Please try again later.';
        }
      );
  }

  saveAboutSection(): void {
    this.errorMessage = ''; // Clear any previous error messages
    this.http.post(`http://localhost:5180/api/user/updateAboutSection/${this.userId}`, { about: this.userProfile.about }, { responseType: 'text' })
      .subscribe(
        (response) => {
          console.log('About section saved successfully:', response);
          this.notificationMessage = 'About section saved successfully.';
          this.cdr.detectChanges(); // Trigger change detection
          setTimeout(() => {
            this.notificationMessage = ''; // Clear the notification after 3 seconds
          }, 3000);
        },
        (error) => {
          console.error('Error saving about section:', error);
          this.errorMessage = 'Error saving about section. No Changes Made';
        }
      );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const url = URL.createObjectURL(this.selectedFile);
      this.profileImage = this.sanitizer.bypassSecurityTrustUrl(url);
      this.isUploaded = false;
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http.post(`http://localhost:5180/api/user/uploadImage/${this.userId}`, formData, { responseType: 'text' })
        .subscribe(
          (response) => {
            console.log('Image uploaded successfully:', response);
            this.loadProfileImage();
            this.isUploading = false;
            this.isUploaded = true;
          },
          (error) => {
            console.error('Error uploading image:', error);
            this.isUploading = false;
          }
        );
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
