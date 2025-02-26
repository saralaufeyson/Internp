import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllGoalsCount();
    this.getPocStats();
    this.getUserGoals();
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
        labels: usernames,  // Categories on each axis (users)
        datasets: [{
          label: 'Total Goals',
          data: goalCounts,  // Values corresponding to each user
          backgroundColor: 'rgba(0, 230, 230, 0.2)', // Semi-transparent cyan fill
          borderColor: '#00bfbf',  // Darker cyan for border
          pointBackgroundColor: '#00bfbf',  // Point color
          pointBorderColor: '#fff',  // White border around points
          pointHoverBackgroundColor: '#ff9f40', // Orange hover effect
          pointHoverBorderColor: '#333'  // Darker hover border
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {  // "r" is the radial scale
            angleLines: {
              display: true  // Show angle lines
            },
            suggestedMin: 0,  // Min value for radar chart
            suggestedMax: Math.max(...goalCounts) + 1 // Dynamic max
          }
        },
        plugins: {
          legend: {
            display: true, // Show legend
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
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

