import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule // <-- Include CommonModule here
  ],  // <-- Include ReactiveFormsModule here
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
})
export class GoalsComponent implements OnInit {
  form: FormGroup;
  monthGoals: string = '';
  yearGoals: string = '';

  constructor() {
    // Initialize the form with empty values and basic validation
    this.form = new FormGroup({
      monthGoal: new FormControl('', [Validators.required]),
      yearGoal: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // Retrieve saved goals from localStorage (if any)
    this.loadGoals();
  }

  // Load the user's saved goals (if they exist)
  loadGoals() {
    const savedMonthGoal = localStorage.getItem('monthGoal');
    const savedYearGoal = localStorage.getItem('yearGoal');
    
    if (savedMonthGoal) {
      this.monthGoals = savedMonthGoal;
    }

    if (savedYearGoal) {
      this.yearGoals = savedYearGoal;
    }
  }

  // Submit the form and save the goals to localStorage
  onSubmit() {
    if (this.form.valid) {
      const { monthGoal, yearGoal } = this.form.value;

      // Save the goals to localStorage (you can replace this with an API call)
      localStorage.setItem('monthGoal', monthGoal);
      localStorage.setItem('yearGoal', yearGoal);

      // Set the values to display in the component
      this.monthGoals = monthGoal;
      this.yearGoals = yearGoal;

      // Optionally reset the form after submission
      this.form.reset();
    }
  }
}
