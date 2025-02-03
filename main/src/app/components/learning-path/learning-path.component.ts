import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-learning-path',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.css']
})
export class LearningPathComponent implements OnInit {
  courseForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      duration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Only numbers
      progress: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.courseForm.valid) {
      const newCourse = this.courseForm.value;
      this.http.post('http://localhost:5180/api/userdata/addLearningPath', newCourse).subscribe(
        (response) => {
          console.log('Learning Path added successfully', response);
          this.courseForm.reset();
        },
        (error) => {
          console.error('Error adding Learning Path', error);
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }
}