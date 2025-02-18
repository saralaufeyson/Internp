import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.css'],
})
export class SideLoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Add email validator
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { } // Inject MatSnackBar

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(
        (response) => {
          console.log('Login successful', response);

          if (response && response.userId) {
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('role', response.role);
            console.log('User Role saved to localStorage:', response.role)
            console.log('User ID saved to localStorage:', response.userId);

            // Redirect based on user role
            if (response.role === 'Intern') {
              this.router.navigate(['/dashboard/intern-dashboard']);
            } else if (response.role === 'Admin') {
              this.router.navigate(['/dashboard/admin']);
            }
            else if (response.role === 'Mentor') {
              this.router.navigate(['/dashboard/mentor']);
            }
            
          }
        },
        (error) => {
          console.error('Login failed', error);
          this.snackBar.open('Could not login. Please check your credentials.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.form.controls['password'].setErrors({ incorrect: true }); // Set error on password field
        }
      );
    }
  }
}
