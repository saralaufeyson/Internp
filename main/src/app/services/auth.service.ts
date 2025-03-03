import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  register(user: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      responseType: 'text',
    });
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
