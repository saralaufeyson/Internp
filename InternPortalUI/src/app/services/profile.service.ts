import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserDataService } from './user-data.service.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDataService implements IUserDataService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserProfile/${userId}`);
  }

  getProfileImage(userId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/getProfileImage/${userId}`, { responseType: 'blob' });
  }

  getAboutSection(userId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/getAboutSection/${userId}`, { responseType: 'text' });
  }

  updateAboutSection(userId: string, about: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/updateAboutSection/${userId}`, { about }, { responseType: 'text' });
  }

  uploadImage(userId: string, formData: FormData): Observable<string> {
    return this.http.post(`${this.apiUrl}/uploadImage/${userId}`, formData, { responseType: 'text' });
  }
}