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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
  styleUrls: ['./side-register.component.css'],
})
export class SideRegisterComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('Intern', [Validators.required]), // Default role is Intern
  });

  showNotification = false;
  notificationMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      // Send form data for registration
      this.authService.register(this.form.value).subscribe(
        (response: string) => {
          // Since the server responds with plain text, handle it accordingly
          console.log('Registration successful:', response);
          if (response.includes('User registered successfully')) {
            this.showNotificationMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
              this.router.navigate(['/authentication/login']); // Redirect to login page after notification
            }, 3000); // Show notification for 3 seconds
          } else {
            console.error('Unexpected response:', response);
          }
        },
        (error) => {
          console.error('Registration failed', error);
        }
      );
    }
  }

  showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000); // Hide notification after 3 seconds
  }
}
