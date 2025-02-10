import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboardc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboardc.component.html',
  styleUrl: './dashboardc.component.css'
})
export class DashboardcComponent implements OnInit {
  userId: any = localStorage.getItem('userId');
  goalCount: number | undefined;
  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  ngOnInit() {
    this.updateGoalCount();
    this.updatePocCount();
  }
  pocCount: { totalPocs: number; inProgressPocs: number; completedPocs: number } | undefined;

  updatePocCount() {
    if (!this.userId) {
      console.error('User ID is not defined');
      return;
    }
    this.http.get(`http://localhost:5180/api/User/getPocProjectStats/${this.userId}`)
      .subscribe({
        next: (response: any) => {
          this.pocCount = {
            totalPocs: response.totalPocs,
            inProgressPocs: response.inProgressPocs,
            completedPocs: response.completedPocs
          };
          console.log('POC count:', this.pocCount);
        },
        error: (error: any) => {
          console.error('Failed to fetch POC count:', error);
        }
      });
  }
  updateGoalCount() {
    if (!this.userId) {
      console.error('User ID is not defined');
      return;
    }
    this.http.get(`http://localhost:5180/api/UserData/getGoalCount/${this.userId}`)
      .subscribe({
        next: (response: any) => {
          this.goalCount = response.count;
          console.log('Goal count:', response.count);
        },
        error: (error: any) => {
          console.error('Failed to fetch goal count:', error);
        }
      });
  }
}