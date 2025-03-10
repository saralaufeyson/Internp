import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboardc.component.html',
  styleUrls: ['./dashboardc.component.css']
})
export class DashboardcComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userId: string;
  dashboardData: any;
  goalCount: number | undefined;
  pocCount: { totalPocs: number; inProgressPocs: number; completedPocs: number } | undefined;
  pocs: any[] = [];
  pieChart: Chart | undefined;
  radarChart: Chart<'radar'> | undefined;
  semiPieChart: Chart | undefined;
  learningPathProgress: number | undefined;

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
      this.fetchInternFeedback();
      this.fetchLearningPathProgress();
      this.fetchPocs();
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

  fetchInternFeedback(): void {
    if (this.userId) {
      this.http.get(`http://localhost:5180/api/internfeedback/${this.userId}`).subscribe({
        next: (response: any) => {
          this.createRadarChart(response.ratings);
        },
        error: (error: any) => {
          console.error('Error fetching intern feedback:', error);
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

      const labels = Object.keys(ratings);
      const data = Object.values(ratings) as number[];

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
                display: false
              },
              suggestedMin: 0,
              suggestedMax: 5,
              ticks: {
                backdropColor: 'transparent' // Ensure ticks are not trimmed
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
          const progressValues = response.map((path: any) => path.progress);
          const totalProgress = progressValues.reduce((acc: number, progress: number) => acc + progress, 0);
          this.learningPathProgress = totalProgress / progressValues.length;
          this.createSemiPieChart();
        },
        error: (error: any) => {
          console.error('Error fetching learning path progress:', error);
        }
      });
    }
  }

  createSemiPieChart(): void {
    // Destroy previous chart instance if it exists
    if (this.semiPieChart) {
      this.semiPieChart.destroy();
    }

    // Ensure DOM is ready and canvas exists
    setTimeout(() => {
      const canvas = document.getElementById('learningPathPieChart') as HTMLCanvasElement | null;
      if (!canvas) {
        console.error('Failed to find the canvas element for the semi-pie chart');
        return;
      }

      const completed = this.learningPathProgress || 0;
      const yetToComplete = 100 - completed;

      this.semiPieChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Yet to Complete'],
          datasets: [{
            data: [completed, yetToComplete],
            backgroundColor: ['#1B3E9C', '#00e6e6'],
            hoverBackgroundColor: ['#1B3E9C', '#00e6e6'],
            borderWidth: 1,
             // Make the pie thinner
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          rotation: -90,
          circumference: 180
        }
      });
    }, 300);
  }

  fetchPocs(): void {
    if (this.userId) {
      this.pocService.getPocProjects(this.userId).subscribe({
        next: (response: any) => {
          this.pocs = response;
        },
        error: (error: any) => {
          console.error('Error fetching POCs:', error);
        }
      });
    }
  }
}