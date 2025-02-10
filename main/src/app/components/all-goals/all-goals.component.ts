import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
interface Goal {
  goalName: string;
  description: string;
  userId: string;
  createdAt: string;
}

@Component({
  standalone: true,
  imports : [DatePipe , CommonModule],
  selector: 'app-all-goals',
  templateUrl: './all-goals.component.html',
  styleUrls: ['./all-goals.component.css']
})
export class AllGoalsComponent implements OnInit {
  goals: Goal[] = [];
  errorMessage: string = '';
  private apiUrl = 'http://localhost:5180/api/userdata/getAllGoals';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllGoals();
  }

  fetchAllGoals(): void {
    this.http.get<Goal[]>(this.apiUrl).subscribe(
      (data) => {
        this.goals = data;
      },
      (error) => {
        console.error('Error fetching goals:', error);
        this.errorMessage = 'Failed to load goals';
      }
    );
  }
}
