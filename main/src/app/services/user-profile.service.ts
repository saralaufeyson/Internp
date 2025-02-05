import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  hobbies: string[];
  specialization: string;
  education: string;
  yearsOfExperience: number;
  skills: string[];
  bio: string;
  linkedinUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = 'http://localhost:5180/api/userprofile'; // Update if needed

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  createUserProfile(profile: UserProfile): Observable<any> {
    return this.http.post<any>(this.apiUrl, profile);
  }

  updateUserProfile(id: string, profile: UserProfile): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, profile);
  }

  deleteUserProfile(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
