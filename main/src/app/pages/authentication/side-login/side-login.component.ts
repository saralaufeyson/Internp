import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.css'],
})
export class SideLoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) { }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(
        (response) => {
          if (response && response.userId) {
            localStorage.setItem('userId', response.userId);
            console.log('User ID saved to localStorage:', response.userId);
          }
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }
}
