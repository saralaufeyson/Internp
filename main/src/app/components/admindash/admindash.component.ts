import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admindash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.css']
})
export class AdmindashComponent implements OnInit {
  allGoalsCount: number = 0;
  totalPocs: number = 0;
  inProgressPocs: number = 0;
  completedPocs: number = 0;
  totalInterns: number = 0;
  totalMentors: number = 0; // Add property to store total number of mentors

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.getAllGoalsCount();
    this.getPocStats();
    this.getUserGoals();
    this.getTotalInterns();
    this.getTotalMentors(); // Fetch total number of mentors
  }

  getAllGoalsCount(): void {
    this.http.get<{ count: number }>('http://localhost:5180/api/userdata/getAllGoalsCount').subscribe(
      (response) => {
        this.allGoalsCount = response.count;
      },
      (error) => {
        console.error('Error fetching all goals count:', error);
      }
    );
  }

  getPocStats(): void {
    this.http.get<{ totalPocs: number, inProgressPocs: number, completedPocs: number }>('http://localhost:5180/api/user/getAllPocProjectStats').subscribe(
      (response) => {
        this.totalPocs = response.totalPocs;
        this.inProgressPocs = response.inProgressPocs;
        this.completedPocs = response.completedPocs;
        this.createPieChart();
      },
      (error) => {
        console.error('Error fetching PoC stats:', error);
      }
    );
  }

  getUserGoals(): void {
    this.http.get<any[]>('http://localhost:5180/api/userdata/getAllUsersGoalCount').subscribe(
      (response) => {
        const usernames = response.map(user => user.username);
        const goalCounts = response.map(user => user.goalCount);
        this.createRadarChart(usernames, goalCounts);
      },
      (error) => {
        console.error('Error fetching user goals:', error);
      }
    );
  }

  getTotalInterns(): void {
    this.http.get<{ count: number }>('http://localhost:5180/api/user/getAllInternsCount').subscribe(
      (response) => {
        this.totalInterns = response.count;
      },
      (error) => {
        console.error('Error fetching total interns count:', error);
      }
    );
  }

  getTotalMentors(): void {
    this.userService.getAllMentorsCount().subscribe(
      (response) => {
        this.totalMentors = response.count;
      },
      (error) => {
        console.error('Error fetching total mentors count:', error);
      }
    );
  }

  createPieChart(): void {
    const ctx = document.getElementById('pocPieChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['In Progress', 'Completed'],
        datasets: [{
          data: [this.inProgressPocs, this.completedPocs],
          backgroundColor: ['#00e6e6', '#1B3E9C'],
          hoverBackgroundColor: ['#00e6e6', '#1B3E9C']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createRadarChart(usernames: string[], goalCounts: number[]): void {
    const ctx = document.getElementById('userGoalsRadarChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: usernames,
        datasets: [{
          label: 'Total Goals',
          data: goalCounts,
          backgroundColor: 'rgba(0, 230, 230, 0.2)',
          borderColor: '#00bfbf',
          pointBackgroundColor: '#00bfbf',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#ff9f40',
          pointHoverBorderColor: '#333'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: Math.max(...goalCounts) + 1
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }
}

