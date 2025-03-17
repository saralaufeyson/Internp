import { Component, OnInit } from '@angular/core';
import { GoalsService } from '../../../services/goals.service'; // Import GoalsService
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

interface Goal {
  goalName: string;
  description: string;
  userId: string;
  username: string; // Add username property
  createdAt: string;
  status: string; // Add status property
  startDate: string; // Add startDate property
  endDate: string; // Add endDate property
}

@Component({
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  selector: 'app-all-goals',
  templateUrl: './all-goals.component.html',
  styleUrls: ['./all-goals.component.css']
})
export class AllGoalsComponent implements OnInit {
  goals: Goal[] = [];
  filteredGoals: Goal[] = [];
  uniqueUsernames: string[] = [];
  selectedUsernames: Set<string> = new Set();
  showDropdown: boolean = false;
  errorMessage: string = '';

  constructor(private goalsService: GoalsService) { }

  ngOnInit(): void {
    this.fetchAllGoals();
  }

  fetchAllGoals(): void {
    this.goalsService.getAllGoals().subscribe(
      (data) => {
        this.goals = data;
        this.filteredGoals = data; // Initialize filteredGoals
        this.uniqueUsernames = [...new Set(data.map(goal => goal.username))]; // Get unique usernames
      },
      (error) => {
        console.error('Error fetching goals:', error);
        this.errorMessage = 'Failed to load goals';
      }
    );
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  onCheckboxChange(event: any): void {
    const username = event.target.value;
    if (event.target.checked) {
      this.selectedUsernames.add(username);
    } else {
      this.selectedUsernames.delete(username);
    }
  }

  applyFilter(): void {
    if (this.selectedUsernames.size > 0) {
      this.filteredGoals = this.goals.filter(goal =>
        this.selectedUsernames.has(goal.username)
      );
    } else {
      this.filteredGoals = this.goals;
    }
    this.showDropdown = false; // Hide dropdown after applying filter
  }
}
