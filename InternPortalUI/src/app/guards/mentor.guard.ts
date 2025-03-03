import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class MentorGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean {
        const role = localStorage.getItem('role');
        if (role === 'Mentor') {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
