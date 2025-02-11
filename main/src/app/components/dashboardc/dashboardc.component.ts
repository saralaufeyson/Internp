import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboardc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboardc.component.html',
  styleUrls: ['./dashboardc.component.css']
})
export class DashboardcComponent implements OnInit, AfterViewInit, OnDestroy {
  userId: string | null = localStorage.getItem('userId');
  goalCount: number | undefined;
  pocCount: { totalPocs: number; inProgressPocs: number; completedPocs: number } | undefined;
  pieChart: Chart | undefined; // Ensure it's properly typed

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.updateGoalCount();
    this.updatePocCount();
  }

  ngAfterViewInit() {
    // Chart creation will now happen inside updatePocCount() after data loads
  }

  ngOnDestroy() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
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
          type: 'pie',
          data: {
            labels: ['In Progress POCs', 'Completed POCs'],
            datasets: [{
              data: [this.pocCount.inProgressPocs, this.pocCount.completedPocs],
              backgroundColor: ['#FFCE56', '#FF6384'],
              hoverBackgroundColor: ['#FFCE56', '#FF6384']
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
}