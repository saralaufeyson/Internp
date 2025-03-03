import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PocService {
  private baseUrl = `${environment.apiUrl}/userdata`;

  constructor(private http: HttpClient) { }

  getPocProjects(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getPocProjects/${userId}`);
  }

  addPocProject(pocData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addPocProject`, pocData, { responseType: 'text' });
  }

  deletePocProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deletePocProject/${projectId}`);
  }

  updatePocProject(projectId: string, updatedPoc: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updatePocProject/${projectId}`, updatedPoc);
  }
}
