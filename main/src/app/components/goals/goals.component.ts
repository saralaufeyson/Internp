import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
})
export class GoalsComponent implements OnInit {
  form: FormGroup;
  goals: any[] = [];
  userId: string = '';  // Get the logged-in user ID here (e.g., from LocalStorage or an AuthService)

  constructor(private http: HttpClient) {
    this.form = new FormGroup({
      goalName: new FormControl('', [Validators.required]),
      goalDescription: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';

    if (this.userId) {
      this.loadGoals();
    } else {
      console.error('User ID is not available');
    }
  }

  loadGoals() {
    if (!this.userId) {
      console.error('User ID not found. Cannot load goals.');
      return;
    }

    this.http.get(`http://localhost:5180/api/userdata/getGoals/${this.userId}`)
      .subscribe(
        (response: any) => {
          this.goals = response || [];
        },
        (error) => {
          console.error('Failed to fetch goals:', error);
        }
      );
  }

  onSubmit() {
    if (this.form.valid) {
      const { goalName, goalDescription } = this.form.value;

      const goalData = {
        goalName: goalName,
        description: goalDescription,
        userId: this.userId,
        createdAt: new Date(),
      };

      this.http.post(`http://localhost:5180/api/userdata/addGoal`, goalData)
        .subscribe(
          (response) => {
            this.goals.push(goalData);
            this.form.reset();
            this.updateGoalCount();
          },
          (error) => {
            console.error('Error saving goal:', error);
          }
        );
    }
  }

  updateGoalCount() {
    this.http.get(`http://localhost:5180/api/userdata/getGoalsCount/${this.userId}`)
      .subscribe(
        (response: any) => {
          console.log('Goal count:', response.count);
        },
        (error) => {
          console.error('Failed to fetch goal count:', error);
        }
      );
  }
}
