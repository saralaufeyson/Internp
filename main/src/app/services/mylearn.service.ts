import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class mylearnService {
  private apiUrl = 'http://localhost:5180/api/UserData';

  constructor(private http: HttpClient) { }

  addLearningPathStatus(learningPathStatus: any): Observable<any> {
    const url = `${this.apiUrl}/addLearningPathStatus`;
    return this.http.post(url, learningPathStatus);
  }
  deleteLearningPathStatus(learningPathStatusId: string): Observable<any> {
    const url = `${this.apiUrl}/deleteLearningPathStatus/${learningPathStatusId}`;
    return this.http.delete(url);
  }

  getLearningPathStatus(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getLearningPathStatus/${userId}`);
  }
}