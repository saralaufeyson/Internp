import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getUserProfile/${userId}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAllUsers`);
  }

  getInterns(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getInterns`);
  }

  getMentors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getMentors`);
  }

  getAllInternsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/getAllInternsCount`);
  }

  getAllMentorsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/getAllMentorsCount`);
  }

  assignInternsToMentor(mentorId: string, internIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/assignInternsToMentor`, { mentorId, internIds });
  }

  getMentorsWithInterns(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getMentorsWithInterns`);
  }
}
