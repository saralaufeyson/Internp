import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  private apiUrl = 'http://localhost:5180/api/userdata'; // Ensure consistent URL casing

  constructor(private http: HttpClient) { }

  getLearningPaths(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getLearningPaths`);
  }

  addLearningPathStatus(userId: string, learningPathStatus: any): Observable<any> { // Fix method signature
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/addLearningPathStatus`, JSON.stringify(learningPathStatus), { headers });
  }

  getLearningPathStatus(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getLearningPathStatus/${userId}`);
  }
}
