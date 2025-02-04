import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private apiUrl = 'http://localhost:5180/api/userData';

  constructor(private http: HttpClient) {}

  // Fetch user profile
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserProfile/${userId}`);
  }

  // Fetch user goals
  getGoals(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getGoals/${userId}`);
  }

  // Fetch user POC projects
  getPocProjects(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getPocProjects/${userId}`);
  }

  // Fetch user learning paths
  getLearningPaths(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getLearningPaths/${userId}`);
  }
}