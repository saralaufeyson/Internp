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
  selectedIntern: any;
  selectedReviewMonth: string | null = null;

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
      (data: any[]) => {
        this.groupFeedbacksByIntern(data);
      },
      (error: any) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
  }
  
  groupFeedbacksByIntern(feedbacks: any[]): void {
    const grouped: { [internId: string]: any } = {};
  
    feedbacks.forEach(feedback => {
      if (!grouped[feedback.internId]) {
        grouped[feedback.internId] = {
          internId: feedback.internId,
          fullName: feedback.fullName,
          feedbacksByMonth: {} // Store feedbacks grouped by review month
        };
      }
      const reviewMonth = feedback.reviewMonth;
      if (!grouped[feedback.internId].feedbacksByMonth[reviewMonth]) {
        grouped[feedback.internId].feedbacksByMonth[reviewMonth] = [];
      }
      grouped[feedback.internId].feedbacksByMonth[reviewMonth].push(feedback);
    });
  
    this.feedbacks = Object.values(grouped);
  }

  selectReviewMonth(reviewMonth: string): void {
    this.selectedReviewMonth = reviewMonth;
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

  selectIntern(intern: any): void {
    this.selectedIntern = intern;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}