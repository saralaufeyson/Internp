import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { GoalsService } from '../../../services/goals.service'; // Import GoalsService
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

  // New properties for editing goals
  editingGoal: any = null;
  editForm: FormGroup;

  showForm: boolean = false;
  showPopup: boolean = false;

  constructor(private goalsService: GoalsService) {
    // Initialize the form with goalName, goalDescription, status, startDate, and endDate fields
    this.form = new FormGroup({
      goalName: new FormControl('', [Validators.required]),
      goalDescription: new FormControl('', [Validators.required]),
      status: new FormControl('inProgress', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl(''),
    });

    // Initialize the edit form
    this.editForm = new FormGroup({
      status: new FormControl('', [Validators.required]),
      endDate: new FormControl('')
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

    this.goalsService.getGoals(this.userId).subscribe(
      (response: any) => {
        console.log('Fetched goals:', response);
        // Update the component's goals state with the fetched data
        this.goals = (response.map((goal: any) => ({
          ...goal,
          status: goal.status,
          startDate: goal.startDate,
          endDate: goal.endDate
        })) || []).reverse(); // Reverse the order of goals
      },
      (error) => {
        console.error('Failed to fetch goals:', error);
      }
    );
  }

  // Method to toggle the popup form visibility
  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  // Submit the goal form
  onSubmit() {
    if (this.form.valid) {
      const { goalName, goalDescription, status, startDate, endDate } = this.form.value;

      const goalData = {
        goalName: goalName,
        description: goalDescription,
        status: status,
        startDate: startDate,
        endDate: status === 'completed' ? endDate : null,
        userId: this.userId,
        createdAt: new Date(),
      };

      // Make API call to store the new goal
      this.goalsService.addGoal(goalData).subscribe(
        (response) => {
          console.log('Goal saved successfully', response);
          // Add the newly created goal to the component's goals list
          const newGoal = {
            _id: response._id, // Ensure the response contains the new goal's ID
            ...goalData
          };
          this.goals.push(newGoal);
          this.form.reset();  // Reset the form after submission
          this.updateGoalCount(); // Update the goal count after adding a new goal
          this.togglePopup(); // Close the popup form after submission
        },
        (error) => {
          console.error('Error saving goal:', error);
        }
      );
    }
  }

  // Method to update the goal count
  updateGoalCount() {
    this.goalsService.getGoalsCount(this.userId).subscribe(
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
    this.goalsService.deleteGoal(goalId).subscribe(
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

  // Method to set the goal to be edited
  editGoal(goal: any) {
    if (this.editingGoal && this.editingGoal._id === goal._id) {
      this.editingGoal = null; // Deselect the goal if it's already selected
    } else {
      this.editingGoal = goal;
      this.editForm.setValue({
        status: goal.status,
        endDate: goal.endDate || ''
      });
    }
  }

  // Method to update the goal
  updateGoal() {
    if (this.editForm.valid && this.editingGoal) {
      const { status, endDate } = this.editForm.value;
      const updatedGoalData = {
        status: status,
        endDate: status === 'completed' ? endDate : null
      };

      this.goalsService.updateGoal(this.editingGoal._id, updatedGoalData).subscribe(
        (response) => {
          console.log('Goal updated successfully', response);
          // Update the goal in the goals array
          const index = this.goals.findIndex(goal => goal._id === this.editingGoal._id);
          if (index !== -1) {
            this.goals[index] = { ...this.goals[index], ...updatedGoalData };
          }
          this.editingGoal = null; // Reset editingGoal after update
        },
        (error) => {
          console.error('Error updating goal:', error);
        }
      );
    }
  }

  // Method to toggle the form visibility
  toggleForm() {
    this.showForm = !this.showForm;
  }
}
