import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MentorMenteeService {
  private apiUrl = 'http://localhost:5180/api/MentorMentee'; // Adjust as needed

  constructor(private http: HttpClient) {}

  getMentorMentees(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
