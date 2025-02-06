import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private apiUrl = 'http://localhost:5180/api/user'; // Ensure this matches your backend API base URL

  constructor(private http: HttpClient) {}

  // Fetch user profile
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserProfile/${userId}`);
  }
}