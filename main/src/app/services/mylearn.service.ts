import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MylearnService { // Capitalize the service name
  private apiUrl = 'http://localhost:5180/api/userdata'; // Ensure consistent URL casing

  constructor(private http: HttpClient) { }

  addLearningPathStatus(learningPathStatus: any): Observable<any> {
    const url = `${this.apiUrl}/addLearningPathStatus`;
    return this.http.post(url, learningPathStatus);
  }

  getLearningPathStatus(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getLearningPathStatus/${userId}`);
  }
}