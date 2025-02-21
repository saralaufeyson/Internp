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

  constructor(private http: HttpClient) {}

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
}
