import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { UserDetailsService } from '../../../../services/user-details.service';
import { RouterModule } from '@angular/router';
import { GoalsService } from '../../../../services/goals.service'; // Import GoalsService
import { LearningPathService } from '../../../../services/learning-path.service'; // Import LearningPathService
import { PocService } from '../../../../services/poc.service'; // Import PocService

Chart.register(...registerables);

@Component({
  selector: 'app-dashboardc',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule to imports
  templateUrl: './dashboardc.component.html',
  styleUrls: ['./dashboardc.component.css']
})
export class DashboardcComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userId: string;
  dashboardData: any;
  goalCount: number | undefined;
  pocCount: { totalPocs: number; inProgressPocs: number; completedPocs: number } | undefined;
  pieChart: Chart | undefined;
  radarChart: Chart<'radar'> | undefined;
  semiPieChart: Chart | undefined;
  learningPathProgress: any[] = []; // Update to store individual progress
  availableMonths: Date[] = []; // Use dynamic list of months
  selectedMonth: Date | null = null; // Add selected month
  feedbackData: any = {}; // Add feedback data

  constructor(
    private http: HttpClient,
    private userDetailsService: UserDetailsService,
    private goalsService: GoalsService,
    private learningPathService: LearningPathService,
    private pocService: PocService
  ) { }

  ngOnInit() {
    if (this.userId) {
      console.log('DashboardcComponent initialized with userId:', this.userId);
      this.updateGoalCount();
      this.updatePocCount();
      this.fetchDashboardData();
      this.fetchLearningPathProgress(); // Fetch learning path progress
      this.fetchAvailableMonths(); // Fetch available months
    } else {
      console.error('DashboardcComponent initialized without userId');
    }
  }

  ngAfterViewInit() {
    // Chart creation will now happen inside updatePocCount() after data loads
  }

  ngOnDestroy() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.radarChart) {
      this.radarChart.destroy();
    }
    if (this.semiPieChart) {
      this.semiPieChart.destroy();
    }
  }

  updateGoalCount() {
    if (!this.userId) {
      console.error('User ID is not defined');
      return;
    }
    this.goalsService.getGoalCount(this.userId).subscribe({
      next: (response: any) => {
        this.goalCount = response.count;
        console.log('Goal count:', response.count);
      },
      error: (error: any) => {
        console.error('Failed to fetch goal count:', error);
      }
    });
  }

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

          // Create the chart only after fetching the data
          this.createPieChart();
        },
        error: (error: any) => {
          console.error('Failed to fetch POC count:', error);
        }
      });
  }

  createPieChart() {
    // Destroy previous chart instance if it exists
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    // Ensure DOM is ready and canvas exists
    setTimeout(() => {
      const canvas = document.getElementById('pocPieChart') as HTMLCanvasElement | null;
      if (!canvas) {
        console.error('Failed to find the canvas element for the pie chart');
        return;
      }

      if (this.pocCount) {
        this.pieChart = new Chart(canvas, {
          type: 'doughnut', // Change 'pie' to 'doughnut'
          data: {
            labels: ['In Progress POCs', 'Completed POCs'],
            datasets: [{
              data: [this.pocCount.inProgressPocs, this.pocCount.completedPocs],
              backgroundColor: ['#00e6e6', '#1B3E9C'],
              hoverBackgroundColor: ['#00e6e6', '#1B3E9C']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false // Ensure chart resizes properly
          }
        });
      }
    }, 300);
  }

  fetchDashboardData(): void {
    if (this.userId) {
      this.userDetailsService.getUserDetails(this.userId).subscribe(
        (data: any) => {
          this.dashboardData = data;
          console.log('Dashboard data:', this.dashboardData);
        },
        (error: any) => {
          console.error('Error fetching dashboard data:', error);
        }
      );
    }
  }

  fetchAvailableMonths(): void {
    if (this.userId) {
      this.http.get(`http://localhost:5180/api/internfeedback/${this.userId}`).subscribe({
        next: (response: any) => {
          this.availableMonths = response.map((feedback: any) => new Date(feedback.reviewMonth));
          if (this.availableMonths.length > 0) {
            this.selectedMonth = this.availableMonths[0];
            this.fetchInternFeedback();
          }
        },
        error: (error: any) => {
          console.error('Error fetching available months:', error);
        }
      });
    }
  }

  fetchInternFeedback(): void {
    if (this.userId && this.selectedMonth) {
      const monthString = new Date(this.selectedMonth).toISOString();
      this.http.get(`http://localhost:5180/api/internfeedback/${this.userId}`).subscribe({
        next: (response: any) => {
          this.feedbackData = response;
          console.log('Intern feedback:', this.feedbackData);

          // Filter feedback data based on selected month
          const filteredFeedback = response.find((feedback: any) => {
            const feedbackMonth = new Date(feedback.reviewMonth).toISOString();
            return feedbackMonth === monthString;
          });

          if (filteredFeedback && filteredFeedback.ratings && Object.keys(filteredFeedback.ratings).length > 0) {
            this.createRadarChart(filteredFeedback.ratings);
          } else {
            this.createRadarChart({});
          }
        },
        error: (error: any) => {
          console.error('Error fetching intern feedback:', error);
          this.createRadarChart({});
        }
      });
    }
  }

  createRadarChart(ratings: any): void {
    // Destroy previous chart instance if it exists
    if (this.radarChart) {
      this.radarChart.destroy();
    }

    // Ensure DOM is ready and canvas exists
    setTimeout(() => {
      const canvas = document.getElementById('internRadarChart') as HTMLCanvasElement | null;
      if (!canvas) {
        console.error('Failed to find the canvas element for the radar chart');
        return;
      }

      const labels = Object.keys(ratings).length > 0 ? Object.keys(ratings) : ['No Feedback'];
      const data = Object.keys(ratings).length > 0 ? Object.values(ratings) as number[] : [0];

      const radarChartData: ChartData<'radar'> = {
        labels: labels,
        datasets: [{
          label: 'Intern Review',
          data: data,
          backgroundColor: 'rgba(0, 230, 230, 0.2)',
          borderColor: '#1B3E9C',
          pointBackgroundColor: '#1B3E9C'
        }]
      };

      const radarChartConfig: ChartConfiguration<'radar'> = {
        type: 'radar',
        data: radarChartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              angleLines: {
                display: true // Enable grid lines
              },
              suggestedMin: 0,
              suggestedMax: 5,
              ticks: {
                stepSize: 1, // Display only integers
                backdropColor: 'transparent', // Ensure ticks are not trimmed
                callback: function (value) {
                  return Number.isInteger(value) ? value : null; // Show only integer values
                }
              }
            }
          }
        }
      };

      this.radarChart = new Chart(canvas, radarChartConfig);
    }, 300);
  }

  fetchLearningPathProgress(): void {
    if (this.userId) {
      this.learningPathService.getLearningPathStatus(this.userId).subscribe({
        next: (response: any) => {
          this.learningPathProgress = response.map((path: any) => ({
            title: path.title,
            progress: Math.round(path.progress / 10) * 10 // Round to nearest multiple of 10
          }));
          this.createBarChart();
        },
        error: (error: any) => {
          console.error('Error fetching learning path progress:', error);
        }
      });
    }
  }

  createBarChart(): void {
    // Destroy previous chart instance if it exists
    if (this.semiPieChart) {
      this.semiPieChart.destroy();
    }

    // Ensure DOM is ready and canvas exists
    setTimeout(() => {
      const canvas = document.getElementById('learningPathPieChart') as HTMLCanvasElement | null;
      if (!canvas) {
        console.error('Failed to find the canvas element for the bar chart');
        return;
      }

      const labels = this.learningPathProgress.map(path => path.title);
      const data = this.learningPathProgress.map(path => path.progress);
      const backgroundColors = [
        '#1B3E9C', '#00e6e6', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ];

      this.semiPieChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: data.map((value, index) => ({
            label: labels[index],
            data: [value],
            backgroundColor: backgroundColors[index],
            borderColor: backgroundColors[index],
            borderWidth: 1,
            barThickness: 20 // Set a fixed bar width
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Disable aspect ratio to allow custom height
          scales: {
            x: {
              display: false // Hide x-axis labels
            },
            y: {
              beginAtZero: true,
              max: 100, // Set the maximum value to 100
              title: {
                display: true,
                text: 'Progress (%)'
              },
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                stepSize: 20, // Show progress in multiples of 10
                callback: function (value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top', // Position the legend at the top
              align: 'start', // Align the legend to the start
              labels: {
                boxWidth: 10, // Adjust the box width
                padding: 20 // Add padding between legend and chart
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.raw;
                  return `${label}: ${value}%`;
                }
              }
            }
          }
        }
      });

      // Set a fixed height for the chart container
      const chartContainer = canvas.parentElement;
      if (chartContainer) {
        chartContainer.style.height = '500px'; // Set desired height
      }
    }, 300);
  }
}