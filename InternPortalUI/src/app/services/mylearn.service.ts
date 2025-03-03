import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MylearnService {
  private apiUrl = `${environment.apiUrl}/UserData`;

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