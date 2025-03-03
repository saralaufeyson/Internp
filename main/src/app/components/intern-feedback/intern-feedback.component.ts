import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-intern-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './intern-feedback.component.html',
  styleUrls: ['./intern-feedback.component.css']
})
export class InternFeedbackComponent {
  feedbackForm: FormGroup;
  apiUrl = 'http://localhost:5180/api/InternFeedback/submit'; // Replace with your actual backend URL
  mentor = localStorage.getItem('user');
  overallRating: number = 0;

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

  ratingTextMap: { [key: number]: string } = {
    1: 'Poor',
    2: 'Need Improvement',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  constructor(private fb: FormBuilder, private http: HttpClient, private dialog: MatDialog) {
    this.createForm();
    this.onRatingsChange();
  }

  get taskForms() {
    return this.feedbackForm.get('tasks') as FormArray;
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      internId: [''],
      fullName: [''],
      
      mentorName: [''],
      
      ratings: this.fb.group(
        this.ratingCriteria.reduce((acc, criteria) => ({
          ...acc,
          [criteria.key]: [0]
        }), {
          overallRating: [0] // Add overallRating inside the ratings form group
        })
      ),
      tasks: this.fb.array([]), // Initialize with an empty array
      recommendation: [''],
      areasOfImprovement: [''],
      feedback: ['']
    });
    this.loadInterns();
    }

    interns: any[] = [];
    months :any[]= [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    loadInterns() {
    const mentorId = localStorage.getItem('userId');
    console.log('Mentor:', this.mentor);
    
    // Retrieve mentor ID from local storage
    if (mentorId) {
      this.http.get(`http://localhost:5180/api/user/getUserProfile/${mentorId}`).subscribe({
      next: (response: any) => {
        const mentorName = response.username;
        localStorage.setItem('userName', mentorName);
      },
      error: (error) => {
        console.error('Error retrieving mentor details:', error);
      }
      });
    }
    if (mentorId) {
      this.http.get(`http://localhost:5180/api/mentor/${mentorId}/interns`).subscribe({
      next: (response: any) => {
        this.interns = response;
      },
      error: (error) => {
        console.error('Error loading interns:', error);
      }
      });
    } else {
      console.error('Mentor ID not found in local storage');
    }
    }

    onInternSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const internId = selectElement.value;
    const selectedIntern = this.interns.find(intern => intern.username === internId);
    if (selectedIntern) {
      this.feedbackForm.patchValue({
        internId: selectedIntern.id,
        fullName: selectedIntern.username,
        mentorName: this.mentor, // Use the mentor variable from loadInterns function
      });
    }
    }
  
  createMonthlyTaskGroup() {
    return this.fb.group({
      taskDetails: [''],
      startDate: [''],
      endDate: [''],
      priority: [''],
      weightage: [0],
      status: ['Yet to start'],
      month:['']
    });
  }

  addTask() {
    this.taskForms.push(this.createMonthlyTaskGroup());
  }

  setRating(event: any, criteriaKey: string) {
    const value = event.target.value;
    this.feedbackForm.get('ratings')?.get(criteriaKey)?.setValue(value);
  }

  getRatingText(value: number): string {
    return this.ratingTextMap[value] || '';
  }

  onRatingsChange() {
    this.feedbackForm.get('ratings')?.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      this.calculateOverallRating();
    });
  }

  calculateOverallRating() {
    const ratings = this.feedbackForm.get('ratings')?.value;
    const total = Object.values(ratings).reduce((acc: number, rating: unknown) => acc + (rating as number), 0);
    this.overallRating = total / this.ratingCriteria.length;
    this.feedbackForm.get('ratings')?.get('overallRating')?.setValue(this.overallRating, { emitEvent: false });
  }

  onSubmit() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.feedbackForm.valid) {
          this.calculateOverallRating();
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
    });
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
