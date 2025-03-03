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
}