import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-intern-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './intern-feedback.component.html',
  styleUrls: ['./intern-feedback.component.css']
})
export class InternFeedbackComponent {
  feedbackForm: FormGroup;
  apiUrl = 'http://localhost:5180/api/InternFeedback/submit'; // Replace with your actual backend URL

  ratingCriteria = [
    { key: 'domainKnowledge', label: 'Domain Knowledge' },
    { key: 'functionalKnowledge', label: 'Functional Knowledge' },
    { key: 'processAdherence', label: 'Process Adherence' },
    { key: 'teamWork', label: 'Team Work' },
    { key: 'learningCapabilities', label: 'Learning Capabilities' },
    { key: 'attentionToDetail', label: 'Attention to Detail' },
    { key: 'communication', label: 'Communication' },
    { key: 'curiosityAndProactiveness', label: 'Curiosity and Proactiveness' },
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'delivery', label: 'Delivery' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.createForm();
  }

  get taskForms() {
    return this.feedbackForm.get('tasks') as FormArray;
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      internId: [''],
      fullName: [''],
      projectBU: [''],
      skillSet: [''],
      mentorName: [''],
      dmName: [''],
      joiningDate: [''],
      validationPeriod: ['6 Months'],
      ratings: this.fb.group(
        this.ratingCriteria.reduce((acc, criteria) => ({
          ...acc,
          [criteria.key]: [0]
        }), {})
      ),
      tasks: this.fb.array([
        this.createMonthlyTaskGroup(),
        this.createMonthlyTaskGroup(),
        this.createMonthlyTaskGroup(),
        this.createMonthlyTaskGroup(),
        this.createMonthlyTaskGroup(),
        this.createMonthlyTaskGroup()
      ]),
      recommendation: [''],
      areasOfImprovement: [''],
      feedback: ['']
    });
  }

  createMonthlyTaskGroup() {
    return this.fb.group({
      taskDetails: [''],
      startDate: [''],
      endDate: [''],
      priority: [''],
      weightage: [0],
      status: ['Yet to start'],
      dmRating: [0]
    });
  }

  setRating(criteriaKey: string, value: number) {
    this.feedbackForm.get('ratings')?.get(criteriaKey)?.setValue(value);
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.http.post(this.apiUrl, this.feedbackForm.value).subscribe({
        next: (response) => {
          console.log('Feedback submitted successfully:', response);
          alert('Feedback submitted successfully!');
          this.feedbackForm.reset(); // Reset form after submission
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
          alert('Failed to submit feedback. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched(this.feedbackForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
