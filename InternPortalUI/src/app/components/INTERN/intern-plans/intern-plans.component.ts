import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-intern-plan',
  imports: [CommonModule, FormsModule],
  templateUrl: './intern-plans.component.html',
  styleUrls: ['./intern-plans.component.css']
})
export class InternPlansComponent implements OnInit {
  userId: string = localStorage.getItem('userId') || '';
  sixMonthPlan: string = '';
  oneYearPlan: string = '';
  threeYearPlan: string = '';
  savedPlans: any = null;
  showNotification = false;
  showForm = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.http.get<any>(`http://localhost:5180/api/InternPlan/${this.userId}`).subscribe(
      (data) => {
        this.savedPlans = data;
      },
      () => {
        this.savedPlans = null; // No plans found
      }
    );
  }

  openForm() {
    if (this.savedPlans) {
      this.sixMonthPlan = this.savedPlans.sixMonthPlan;
      this.oneYearPlan = this.savedPlans.oneYearPlan;
      this.threeYearPlan = this.savedPlans.threeYearPlan;
    }
    this.showForm = true;
  }

  submitPlan() {
    const planData = {
      userId: this.userId,
      sixMonthPlan: this.sixMonthPlan.trim(),
      oneYearPlan: this.oneYearPlan.trim(),
      threeYearPlan: this.threeYearPlan.trim()
    };

    this.http.post('http://localhost:5180/api/InternPlan/submit', planData).subscribe(
      () => {
        // ✅ Clearing text fields properly
        this.sixMonthPlan = '';
        this.oneYearPlan = '';
        this.threeYearPlan = '';

        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);

        this.loadPlans(); // Reload plans after saving
        this.showForm = false; // Hide form after saving
      },
      (error) => {
        console.error('Error submitting plan:', error);
      }
    );
  }
}
