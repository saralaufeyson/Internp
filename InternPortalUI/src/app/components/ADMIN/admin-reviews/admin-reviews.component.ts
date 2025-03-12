import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // Import FormsModule
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.css']
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = []; // Store reviews
  filteredReviews: any[] = []; // Store filtered reviews
  searchQuery: string = ''; // Store search query
  showSearchBar: boolean = false; // Control the visibility of the search bar
  sortKey: string = ''; // Store the key to sort by
  sortDirection: 'asc' | 'desc' = 'asc'; // Store the sort direction

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
            ratingKeys: Object.keys(review.ratings),
            overallRating: review.overallRating, // Ensure overallRating is fetched
            reviewMonth: this.formatReviewMonth(review.reviewMonth) // Format reviewMonth
          }));
          this.filteredReviews = this.reviews; // Initialize filtered reviews
        },
        error: (err) => {
          console.error('Error fetching reviews:', err);
        }
      });
  }

  formatReviewMonth(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString(undefined, options);
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

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }

  filterReviews() {
    this.filteredReviews = this.reviews.filter(review =>
      review.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  sortReviews(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.filteredReviews.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
