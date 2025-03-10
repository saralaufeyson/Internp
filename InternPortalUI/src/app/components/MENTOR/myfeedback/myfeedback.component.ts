import { Component, OnInit } from '@angular/core';
import { MyFeedbackService } from '../../../services/myfeedback.service'; // Corrected import path
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

@Component({
  selector: 'app-myfeedback',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatIconModule], // Add MatIconModule to imports
  providers: [MyFeedbackService], // Provide the service
  templateUrl: './myfeedback.component.html',
  styleUrls: ['./myfeedback.component.scss']
})
export class MyfeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  mentorName: string = localStorage.getItem('user') || ''; // Get the user from local storage

  ratingTextMap: { [key: number]: string } = {
    1: 'Poor',
    2: 'Need Improvement',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  constructor(private myFeedbackService: MyFeedbackService) {}

  ngOnInit(): void {
    this.fetchFeedbacks();
    console.log('Mentor name:', this.mentorName);
  }

  fetchFeedbacks(): void {
    this.myFeedbackService.getFeedbacksByMentor(this.mentorName).subscribe(
      (data: any) => {
        this.feedbacks = data;
        console.log('Feedbacks:', this.feedbacks);
      },
      (error: any) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
  }

  deleteFeedback(internId: string): void {
    this.myFeedbackService.deleteFeedback(internId).subscribe(
      () => {
        this.feedbacks = this.feedbacks.filter(feedback => feedback.internId !== internId);
      },
      (error: any) => {
        console.error('Error deleting feedback:', error);
      }
    );
  }

  getRatingText(value: number): string {
    return this.ratingTextMap[value] || '';
  }
}