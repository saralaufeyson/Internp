import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  private apiUrl = `${environment.apiUrl}/learningpath`; // Updated base URL

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

  updateLearningPathProgress(learningPathStatusId: string, progress: number) {
    return this.http.put(`${this.apiUrl}/updateLearningPathProgress/${learningPathStatusId}`, { progress });
  }

  updateSubtopicStatus(learningPathStatusId: string, subtopic: any): Observable<any> {
    const url = `${this.apiUrl}/updateSubtopicStatus/${learningPathStatusId}/${subtopic.name}`;
    return this.http.put(url, subtopic);
  }
}
