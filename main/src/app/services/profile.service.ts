import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private apiUrl = 'http://localhost:5180/api/userData'; // Ensure this matches your backend API base URL

  constructor(private http: HttpClient) {}

  // Fetch user profile
  // getUserProfile(userId: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/getUserProfile/${userId}`);
  // }

  // // Fetch user goals
  // getGoals(userId: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/getGoals/${userId}`);
  // }

  // // Fetch user POC projects
  // getPocProjects(userId: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/getPocProjects/${userId}`);
  // }

  // // Fetch user learning paths
  // getLearningPaths(userId: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/getLearningPaths/${userId}`);
  // }

  // // Add a new goal
  // addGoal(goalData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/addGoal`, goalData);
  // }

  // // Add a new PoC project
  // addPocProject(pocData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/addPocProject`, pocData);
  // }

  // // Add a new learning path
  // addLearningPath(learningPathData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/addLearningPath`, learningPathData);
  // }
}