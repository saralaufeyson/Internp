import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PocService } from 'src/app/services/poc.service';

@Component({
  selector: 'app-poc-projects',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './poc-projects.component.html',
  styleUrls: ['./poc-projects.component.css']
})
export class PocProjectsComponent implements OnInit {
  pocForm: FormGroup;
  pocs: Array<any> = [];
  userId: string = ''; // Get the logged-in user's ID here (e.g., from LocalStorage or an AuthService)
  errorMessage: string = '';  // For storing error messages

  constructor(private fb: FormBuilder, private pocService: PocService) {
    this.pocForm = this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      status: ['inProgress', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';

    if (this.userId) {
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

  onSubmit() {
    if (this.pocForm.valid) {
      const newPoc = this.pocForm.value;
      console.log('Form Data:', newPoc);

      this.pocService.addPocProject({
        userId: this.userId,
        projectName: newPoc.projectName,
        description: newPoc.description,
        status: newPoc.status,
        startDate: newPoc.startDate,
        endDate: newPoc.status === 'completed' ? newPoc.endDate : null
      }).subscribe(
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

  deletePocProject(projectId: string): void {
    console.log("Attempting to delete PoC Project with ID:", projectId);

    if (!projectId || typeof projectId !== 'string') {
      console.error("Invalid projectId:", projectId);
      this.errorMessage = "Invalid project ID.";
      return;
    }

    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    this.pocService.deletePocProject(projectId).subscribe({
      next: () => {
        console.log('PoC Project deleted successfully');
        this.pocs = this.pocs.filter(poc => poc._id !== projectId);
      },
      error: (error) => {
        console.error('Error deleting PoC Project', error);
        this.errorMessage = 'Error deleting PoC Project. Please try again later.';
      }
    });
  }

  updatePocStatus(projectId: string, status: string, endDate: string | null) {
    const updatedPoc = { status, endDate };
    this.pocService.updatePocProject(projectId, updatedPoc).subscribe(
      (response: any) => {
        console.log('PoC Project status updated successfully', response);
        const poc = this.pocs.find(p => p._id === projectId);
        if (poc) {
          poc.status = status;
          poc.endDate = status === 'completed' ? endDate : null;
          poc.isEditing = false; // Close the edit box
        }
      },
      (error) => {
        console.error('Error updating PoC Project status', error);
        this.errorMessage = 'Error updating PoC Project status. Please try again later.';
      }
    );
  }

  editPoc(poc: any) {
    poc.isEditing = !poc.isEditing;
  }
}
