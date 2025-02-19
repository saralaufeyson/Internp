import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InternDetailsPopupComponent } from '../../intern-details-popup/intern-details-popup.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-mentor-dash',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './mentor-dash.component.html',
  styleUrls: ['./mentor-dash.component.scss']
})
export class MentorDashComponent implements OnInit {
  mentorGoals: number = 0;
  totalPocs: number = 0;
  inProgressPocs: number = 0;
  completedPocs: number = 0;
  interns: any[] = [];
  internLearningPaths: { [key: string]: any[] } = {};
  learningPaths: any[] = [];
  userId: string = localStorage.getItem('userId') || '';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMentorGoals();
    this.getPocStats();
    this.getInterns();
    this.getInternGoals();
    this.getInternLearningPaths();
  }

  getMentorGoals(): void {
    this.http.get<{ totalGoals: number }>(`http://localhost:5180/api/Mentor/${this.userId}/total-goals`).subscribe(
      (response) => {
        this.mentorGoals = response.totalGoals;
      },
      (error) => {
        console.error('Error fetching mentor goals:', error);
      }
    );
  }

  getPocStats(): void {
    this.http.get<{ totalPocs: number, inProgressPocs: number, completedPocs: number }>(`http://localhost:5180/api/mentor/${this.userId}/poc-project-stats`).subscribe(
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

  getInterns(): void {
    this.http.get<{ id: string, username: string, email: string }[]>(`http://localhost:5180/api/mentor/${this.userId}/interns`).subscribe(
      (response) => {
        this.interns = response;
      },
      (error) => {
        console.error('Error fetching interns:', error);
      }
    );
  }

  getInternGoals(): void {
    this.http.get<{ id: string, username: string, email: string }[]>(`http://localhost:5180/api/mentor/${this.userId}/interns`).subscribe(
      (internsResponse) => {
        this.interns = internsResponse;
        this.http.get<{ internsGoals: { userId: string, goalCount: number }[], totalGoals: number }>(`http://localhost:5180/api/Mentor/${this.userId}/total-goals`).subscribe(
          (goalsResponse) => {
            const internNames = this.interns.map(intern => intern.username);
            const goalCounts = this.interns.map(intern => {
              const goal = goalsResponse.internsGoals.find(g => g.userId === intern.id);
              return goal ? goal.goalCount : 0;
            });

            this.createBarChart(internNames, goalCounts);
          },
          (error) => {
            console.error('Error fetching intern goals:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching interns:', error);
      }
    );
  }

  getInternLearningPaths(): void {
    this.http.get<any[]>('http://localhost:5180/api/Mentor/67aefbdd2145678ce80127ab/interns-learning-paths').subscribe(
      (response) => {
        this.internLearningPaths = response.reduce((acc, path) => {
          if (!acc[path.userId]) {
            acc[path.userId] = [];
          }
          acc[path.userId].push(path);
          return acc;
        }, {});
        this.learningPaths = response; // Assign response to learningPaths
      },
      (error) => {
        console.error('Error fetching intern learning paths:', error);
      }
    );
  }

  openInternDetails(intern: any): void {
    this.dialog.open(InternDetailsPopupComponent, {
      width: '400px',
      data: { internId: intern.id }  // Pass internId to the popup
    });
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
        maintainAspectRatio: true,
        aspectRatio: 1,
      }
    });
  }

  createBarChart(internNames: string[], goalCounts: number[]): void {
    const ctx = document.getElementById('internGoalsBarChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: internNames,
        datasets: [{
          label: 'Goal Count',
          data: goalCounts,
          backgroundColor: '#1B3E9C',
          borderColor: '#1B3E9C',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#000', // Y-axis labels color
              font: {
                size: 14 // Y-axis labels font size
              },
              stepSize: 1 // Ensure only whole numbers are displayed
            },
            grid: {
              color: '#fff' // Y-axis grid line color
            }
          },
          x: {
            ticks: {
              color: '#000', // X-axis labels color
              font: {
                size: 14 // X-axis labels font size
              }
            },
            grid: {
              color: '#fff' // X-axis grid line color
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#000', // Legend labels color
              font: {
                size: 16 // Legend labels font size
              }
            }
          }
        }
      }
    });
  }
  }



