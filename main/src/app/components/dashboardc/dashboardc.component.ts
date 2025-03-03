import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { UserDetailsService } from '../../services/user-details.service';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-dashboardc',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule to imports
  templateUrl: './dashboardc.component.html',
  styleUrls: ['./dashboardc.component.css']
})
export class DashboardcComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userId: string;
  dashboardData: any;
  goalCount: number | undefined;
  pocCount: { totalPocs: number; inProgressPocs: number; completedPocs: number } | undefined;
  pieChart: Chart | undefined; // Ensure it's properly typed

  constructor(private http: HttpClient, private userDetailsService: UserDetailsService) { }

  ngOnInit() {
    if (this.userId) {
      console.log('DashboardcComponent initialized with userId:', this.userId);
      this.updateGoalCount();
      this.updatePocCount();
      this.fetchDashboardData();
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
      
        this.pieChart = new Chart(canvas, {
          type: 'pie',
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
}
