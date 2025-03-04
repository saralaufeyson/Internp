import { Component, OnInit } from '@angular/core';
import { GoalsService } from '../../../services/goals.service'; // Import GoalsService
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

interface Goal {
  goalName: string;
  description: string;
  userId: string;
  username: string; // Add username property
  createdAt: string;
}

@Component({
  standalone: true,
  imports: [DatePipe, CommonModule],
  selector: 'app-all-goals',
  templateUrl: './all-goals.component.html',
  styleUrls: ['./all-goals.component.css']
})
export class AllGoalsComponent implements OnInit {
  goals: Goal[] = [];
  errorMessage: string = '';

  constructor(private goalsService: GoalsService) { }

  ngOnInit(): void {
    this.fetchAllGoals();
  }

  fetchAllGoals(): void {
    this.goalsService.getAllGoals().subscribe(
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
