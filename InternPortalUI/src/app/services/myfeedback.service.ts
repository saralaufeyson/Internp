import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyFeedbackService {
  private apiUrl = `${environment.apiUrl}/internfeedback/mentor`;

  constructor(private http: HttpClient) {}

  getFeedbacksByMentor(mentorName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${mentorName}`);
  }

  deleteFeedback(internId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/internfeedback/${internId}`);
  }

  updateFeedback(feedback: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${feedback.internId}`, feedback);
  }
}
