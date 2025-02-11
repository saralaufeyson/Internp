import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, ReactiveFormsModule],
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

  constructor(private authService: AuthService, private router: Router) { }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe(
        (response: string) => {
          if (response.includes('User registered successfully')) {
            this.router.navigate(['/']); // Redirect to home or login page
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
}
