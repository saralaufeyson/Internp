import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-poc-projects',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './poc-projects.component.html',
  styleUrls: ['./poc-projects.component.css']
})
export class PocProjectsComponent implements OnInit {
  pocForm: FormGroup;
  pocs: Array<any> = [];
  userId: string = ''; // Get the logged-in user's ID here (e.g., from LocalStorage or an AuthService)
  errorMessage: string = '';  // For storing error messages

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.pocForm = this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      status: ['inProgress', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    // Get the logged-in user's ID (replace with your actual logic to get the user ID)
    this.userId = localStorage.getItem('userId') || ''; // Assume the user ID is saved in localStorage

    // Check if userId is available, if not, log an error or handle the missing user ID scenario
    if (this.userId) {
      // Load the user's PoC Projects only if userId is valid
      this.loadPocProjects();
    } else {
      console.error('No user ID found in localStorage. User is not logged in.');
      this.errorMessage = 'No user ID found. Please log in.';
      // Optionally, you could redirect to a login page or show a warning message
    }
  }

  // Fetch user's PoC Projects
  loadPocProjects() {
    console.log("Fetching PoC Projects for UserId:", this.userId);  // Log the userId
  
    this.http.get(`http://localhost:5180/api/userdata/getPocProjects/${this.userId}`)
      .subscribe(
        (response: any) => {
          this.pocs = response || [];
          console.log("PoC Projects fetched successfully:", this.pocs); // Log the fetched data
        },
        (error) => {
          console.error('Error fetching PoC Projects', error);
          this.errorMessage = 'Error fetching PoC Projects. Please try again later.';
        }
      );
  }
  

  // Handle form submission
  onSubmit() {
    if (this.pocForm.valid) {
      const newPoc = this.pocForm.value;
      console.log('Form Data:', newPoc); // Log form data

      // Adjust the request to match backend expectations (projectName instead of title)
      this.http.post(`http://localhost:5180/api/userdata/addPocProject`, {
        userId: this.userId,  // Use actual userId instead of hardcoding
        projectName: newPoc.projectName,  // 'title' changed to 'projectName'
        description: newPoc.description,
        status: newPoc.status,
        startDate: newPoc.startDate,
        endDate: newPoc.status === 'completed' ? newPoc.endDate : null  // endDate is only set if the status is completed
      }, { responseType: 'text' })  // Add responseType: 'text' to handle plain text response
      .subscribe(
        (response: string) => {
          console.log('PoC Project added successfully', response);
          this.pocs.push({
            ...newPoc,
            endDate: newPoc.status === 'completed' ? newPoc.endDate : null
          });
          this.pocForm.reset({
            status: 'inProgress',
            startDate: '',
            endDate: ''
          });
        },
        (error) => {
          console.error('Error adding PoC Project', error);
          this.errorMessage = 'Error adding PoC Project. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'Please fill out the form correctly before submitting.';
    }
  }
}
