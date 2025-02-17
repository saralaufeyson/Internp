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

  addLearningPathStatus(userId: string, learningPathId: string, data: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/addLearningPathStatus`, JSON.stringify(data), { headers });
  }

  getLearningPathStatus(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getLearningPathStatus/${userId}`);
  }

  deleteLearningPathStatus(learningPathStatusId: string): Observable<any> {
    const url = `${this.apiUrl}/deleteLearningPathStatus/${learningPathStatusId}`;
    return this.http.delete(url);
  }
}
