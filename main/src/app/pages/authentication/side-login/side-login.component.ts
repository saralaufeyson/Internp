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

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class SideLoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false), // Add the 'remember' form control
  });

  constructor(private authService: AuthService, private router: Router) {}

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(
        (response) => {
          console.log('Login successful', response);

          // Store userId in localStorage (You should replace `response.userId` with the correct property name in the response)
          if (response && response.userId) {
            localStorage.setItem('userId', response.userId);
            console.log('User ID saved to localStorage:', response.userId);
          }

          // You can optionally store the entire user object, but storing the `userId` should suffice for most cases
          // localStorage.setItem('user', JSON.stringify(response.user)); // If you need to store the whole user object

          // After login, navigate to the dashboard or any other protected page
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }
}
