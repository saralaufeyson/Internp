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
    this.userId = localStorage.getItem('userId') || ''; // Assume the user ID is saved in localStorage

    if (this.userId) {
      this.loadPocProjects();
    } else {
      console.error('No user ID found in localStorage. User is not logged in.');
      this.errorMessage = 'No user ID found. Please log in.';
    }
  }

  loadPocProjects() {
    this.http.get(`http://localhost:5180/api/userdata/getPocProjects/${this.userId}`)
      .subscribe(
        (response: any) => {
          this.pocs = response || [];
        },
        (error) => {
          console.error('Error fetching PoC Projects', error);
          this.errorMessage = 'Error fetching PoC Projects. Please try again later.';
        }
      );
  }

  onSubmit() {
    if (this.pocForm.valid) {
      const newPoc = this.pocForm.value;

      this.http.post(`http://localhost:5180/api/userdata/addPocProject`, {
        userId: this.userId,
        projectName: newPoc.projectName,
        description: newPoc.description,
        status: newPoc.status,
        startDate: newPoc.startDate,
        endDate: newPoc.status === 'completed' ? newPoc.endDate : null
      }, { responseType: 'text' })
        .subscribe(
          (response: string) => {
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
