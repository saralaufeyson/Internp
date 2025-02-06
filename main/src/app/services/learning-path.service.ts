import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  private apiUrl = 'http://localhost:5180/api/userdata/getLearningPaths';  // Update with your actual backend URL

  constructor(private http: HttpClient) { }

  getLearningPaths(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}