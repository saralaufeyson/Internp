import { Component, OnInit } from '@angular/core';
import { MentorService } from '../../../services/mentor.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InternDetailsPopupComponent } from '../../ADMIN/intern-list/intern-details-popup/intern-details-popup.component';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentor-dash',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './mentor-dash.component.html',
  styleUrls: ['./mentor-dash.component.css']
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
  selectedIntern: any;

  constructor(private mentorService: MentorService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMentorGoals();
    this.getPocStats();
    this.getInterns();
    this.getInternGoals();
    this.getInternLearningPaths();
  }

  getMentorGoals(): void {
    this.mentorService.getMentorGoals(this.userId).subscribe(
      (response) => {
        this.mentorGoals = response.totalGoals;
      },
      (error) => {
        console.error('Error fetching mentor goals:', error);
      }
    );
  }

  getPocStats(): void {
    this.mentorService.getPocStats(this.userId).subscribe(
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
    this.mentorService.getInterns(this.userId).subscribe(
      (response) => {
        this.interns = response;
      },
      (error) => {
        console.error('Error fetching interns:', error);
      }
    );
  }

  getInternGoals(): void {
    this.mentorService.getInterns(this.userId).subscribe(
      (internsResponse) => {
        this.interns = internsResponse;
        this.mentorService.getInternGoals(this.userId).subscribe(
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
    this.mentorService.getInternLearningPaths(this.userId).subscribe(
      (response) => {
        this.internLearningPaths = response.reduce((acc, path) => {
          if (!acc[path.userId]) {
            acc[path.userId] = [];
          }
          acc[path.userId].push(path);
          return acc;
        }, {});
        this.learningPaths = response;
      },
      (error) => {
        console.error('Error fetching intern learning paths:', error);
      }
    );
  }

  openInternDetails(intern: any): void {
    this.dialog.open(InternDetailsPopupComponent, {
      width: '800px',
      data: { internId: intern.id }  // Pass internId to the popup
    });
  }

  selectIntern(intern: any): void {
    this.selectedIntern = intern;
  }

  createPieChart(): void {
    const ctx = document.getElementById('pocPieChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['In Progress', 'Completed'],
        datasets: [{
          data: [this.inProgressPocs, this.completedPocs],
          backgroundColor: ['#00e6e6', '#0095FF'],
          hoverBackgroundColor: ['#00e6e6', '#0095FF']
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
          backgroundColor: '#0095FF',
          borderColor: '#0095FF',
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



