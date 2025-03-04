import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'http://localhost:5180/api/UserDetails';

  constructor(private http: HttpClient) {}

  getExperiences(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  deleteExperience(userId: string, index: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/experience/${index}`);
  }

  addExperience(userId: string, experience: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/experience`, experience);
  }
}
