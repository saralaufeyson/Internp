import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InternDetailsPopupComponent } from '../../intern-details-popup/intern-details-popup.component';

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
  userId: string = localStorage.getItem('userId') || '';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMentorGoals();
    this.getPocStats();
    this.getInterns();
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

  openInternDetails(intern: any): void {
    this.dialog.open(InternDetailsPopupComponent, {
      width: '400px',
      data: { internId: intern.id }  // Pass internId to the popup
    });
  }
}
