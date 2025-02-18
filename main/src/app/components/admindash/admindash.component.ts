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

        this.createDoughnutChart(usernames, goalCounts);
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

  createDoughnutChart(usernames: string[], goalCounts: number[]): void {
    const ctx = document.getElementById('userGoalsDoughnutChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: usernames,
        datasets: [{
          data: goalCounts,
          backgroundColor:  [
            '#99ffff',  // Lightest Cyan
            '#66ffff',  // Lighter Cyan
            '#00e6e6',  // Base Cyan
            '#00bfbf',  // Darker Cyan
            '#008f8f',   // Darkest Cyan
            '#6f86c9',  // Lightest Blue
            '#4a66b3',  // Lighter Blue
            '#1B3E9C',  // Base Blue
            '#142d74',  // Darker Blue
            '#0e1f51' ,  // Darkest Blue
            '#f7f7f7',  // Light Gray (Background)
            '#dcdcdc',  // Gray (Borders)
            '#e0e0e0'  , // Light Gray (Panels)
            '#ff9f40',  // Soft Orange
            '#FF6384',  // Coral Red
            '#FFCD56' ,  // Golden Yellow
            '#333333',  // Dark Gray (Body Text)
            '#1a1a1a'   // Almost Black (Headings)
          ],
          hoverBackgroundColor:  [
            '#99ffff',  // Lightest Cyan
            '#66ffff',  // Lighter Cyan
            '#00e6e6',  // Base Cyan
            '#00bfbf',  // Darker Cyan
            '#008f8f',   // Darkest Cyan
            '#6f86c9',  // Lightest Blue
            '#4a66b3',  // Lighter Blue
            '#1B3E9C',  // Base Blue
            '#142d74',  // Darker Blue
            '#0e1f51' ,  // Darkest Blue
            '#f7f7f7',  // Light Gray (Background)
            '#dcdcdc',  // Gray (Borders)
            '#e0e0e0'  , // Light Gray (Panels)
            '#ff9f40',  // Soft Orange
            '#FF6384',  // Coral Red
            '#FFCD56' ,  // Golden Yellow
            '#333333',  // Dark Gray (Body Text)
            '#1a1a1a'   // Almost Black (Headings)
          ]          
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
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
  
