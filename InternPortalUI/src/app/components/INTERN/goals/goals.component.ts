import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <-- Import necessary Angular modules
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
})
export class GoalsComponent implements OnInit {
  form: FormGroup;
  goals: any[] = []; // Array to store saved goals
  userId: string = '';  // Get the logged-in user ID here (e.g., from LocalStorage or an AuthService)

  constructor(private http: HttpClient) {
    // Initialize the form with goalName and goalDescription fields
    this.form = new FormGroup({
      goalName: new FormControl('', [Validators.required]),
      goalDescription: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Get the logged-in user's ID (replace with your actual logic to get the user ID)
    this.userId = localStorage.getItem('userId') || ''; // Assume the user ID is saved in localStorage

    // Load the user's saved goals from the backend
    if (this.userId) {
      this.loadGoals();
    } else {
      console.error('User ID is not available');
    }
  }

  // Fetch saved goals from the backend
  loadGoals() {
    // Make sure the userId is set before making the request
    if (!this.userId) {
      console.error('User ID not found. Cannot load goals.');
      return;
    }

    this.http.get(`http://localhost:5180/api/goal/getGoals/${this.userId}`)
      .subscribe(
        (response: any) => {
          console.log('Fetched goals:', response);
          // Update the component's goals state with the fetched data
          this.goals = response || []; // If no goals, set an empty array
        },
        (error) => {
          console.error('Failed to fetch goals:', error);
        }
      );
  }

  // Submit the goal form
  onSubmit() {
    if (this.form.valid) {
      const { goalName, goalDescription } = this.form.value;

      const goalData = {
        goalName: goalName,
        description: goalDescription,
        userId: this.userId,
        createdAt: new Date(),
      };

      // Make API call to store the new goal
      this.http.post(`http://localhost:5180/api/goal/addGoal`, goalData)
        .subscribe(
          (response) => {
            console.log('Goal saved successfully', response);
            // Optionally add the newly created goal to the component's goals list
            this.goals.push(goalData);
            this.form.reset();  // Reset the form after submission
            this.updateGoalCount(); // Update the goal count after adding a new goal
          },
          (error) => {
            console.error('Error saving goal:', error);
          }
        );
    }
  }

  // Method to update the goal count
  updateGoalCount() {
    this.http.get(`http://localhost:5180/api/goal/getGoalsCount/${this.userId}`)
      .subscribe(
        (response: any) => {
          console.log('Goal count:', response.count);
        },
        (error) => {
          console.error('Failed to fetch goal count:', error);
        }
      );
  }

  // Method to delete a goal
  deleteGoal(goalId: string) {
    this.http.delete(`http://localhost:5180/api/goal/deleteGoal/${goalId}`)
      .subscribe(
        (response) => {
          console.log('Goal deleted successfully', response);
          // Remove the deleted goal from the goals array
          this.goals = this.goals.filter(goal => goal._id !== goalId);
          this.updateGoalCount(); // Update the goal count after deleting a goal
        },
        (error) => {
          console.error('Error deleting goal:', error);
        }
      );
  }
}
