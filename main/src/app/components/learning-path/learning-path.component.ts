import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-learning-path',
  imports: [ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.css']
})
export class LearningPathComponent implements OnInit {

  // Define the form group
  courseForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Initialize the form with default values and validations
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      duration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],  // Only numbers
      progress: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.courseForm.valid) {
      console.log('Course Data:', this.courseForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
}
