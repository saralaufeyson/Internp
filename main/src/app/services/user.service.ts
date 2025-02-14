import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // Corrected import path

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5180/api/user'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Get user profile by userId
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getUserProfile/${userId}`);
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAllUsers`);
  }

  // Get all users who are 'Intern' role
  getInterns(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getInterns`); // Ensure this route exists on your backend
  }

  // Get all users who are 'Mentor' role
  getMentors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getMentors`);
  }

  // Assign intern to mentor
  assignInternsToMentor(mentorId: string, internIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/assignInternsToMentor`, { mentorId, internIds });
  }

  // Get mentors with their assigned interns
  getMentorsWithInterns(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getMentorsWithInterns`);
  }
}
