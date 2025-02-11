import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private apiUrl = 'http://localhost:5180/api/auth'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  register(user: any): Observable<string> { // Expecting plain text response
    return this.http.post(`${this.apiUrl}/register`, user, {
      responseType: 'text', // This makes the response plain text instead of JSON
    });
  }

  getUserRole(userId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/role/${userId}`);
  }



  getRole(): string | null {
    return localStorage.getItem('role');
  }
 
  
 
}
