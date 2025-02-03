import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-poc-projects',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule], // <-- Include CommonModule here
  templateUrl: './poc-projects.component.html',
  styleUrls: ['./poc-projects.component.css']
})
export class PocProjectsComponent {
  pocForm: FormGroup;
  pocs: Array<any> = [];

  constructor(private fb: FormBuilder) {
    // Initialize form group with default values
    this.pocForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['inProgress', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.pocForm.valid) {
      const newPoc = this.pocForm.value;
      this.pocs.push({
        ...newPoc,
        endDate: newPoc.status === 'completed' ? newPoc.endDate : null
      });
      this.pocForm.reset({
        status: 'inProgress', // Reset status to 'inProgress' after submission
        startDate: '',
        endDate: ''
      });
    }
  }
}
