import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Import HttpClientModule
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.css']
})
export class AdminReviewsComponent implements OnInit {
  [x: string]: any;
  reviews: any[] = []; // Store reviews

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchReviews();
  }

  fetchReviews() {
    this.http.get<any[]>('http://localhost:5180/api/InternFeedback')
      .subscribe({
        next: (data) => {
          this.reviews = data.map(review => ({
            ...review,
            ratingKeys: Object.keys(review.ratings)
          }));
        },
        error: (err) => {
          console.error('Error fetching reviews:', err);
        }
      });
  }

  getLabelForKey(key: string): string {
    const criteria = this.ratingCriteria.find(c => c.key === key);
    return criteria ? criteria.label : key;
  }

  getRatingDescription(rating: number): string {
    switch (rating) {
      case 5: return 'Excellent';
      case 4: return 'Good';
      case 3: return 'Average';
      case 2: return 'Need Improvement';
      case 1: return 'Poor';
      default: return 'Unknown';
    }
  }
}
