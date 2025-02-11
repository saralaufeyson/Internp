import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[]; // Get required roles from route
    const userRole = this.authService.getRole(); // Get logged-in user role

    if (userRole && expectedRoles.includes(userRole)) {
      return true; // Allow access if role matches
    } else {
      this.router.navigate(['/dashboard']); // Redirect to dashboard if unauthorized
      return false;
    }
  }
}
