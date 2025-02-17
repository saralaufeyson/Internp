import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

interface UserDetails {
  _id?: string; // Make _id optional
  userId: string;
  phoneNumber: string;
  email: string;
  address: string;
  tenthGrade: string;
  twelfthGrade: string;
  btechCgpa: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private apiUrl = 'http://localhost:5180/api/userdetails'; // Base API URL

  constructor(private http: HttpClient) {}

  // Get user details by userId
  getUserDetails(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/${userId}`);
  }

  // Create new user details
  createUserDetails(details: UserDetails): Observable<UserDetails> {  // Specify return type as UserDetails
    return this.http.post<UserDetails>(`${this.apiUrl}/adddetails`, details); // Use the correct endpoint
  }

  // Update user details
  updateUserDetails(userId: string, details: UserDetails): Observable<any> {
    const userDetailsWithId = { ...details, _id: userId };
  
    console.log('User Details to be updated:', userDetailsWithId);
  
    return this.http.put(`${this.apiUrl}/${userId}`, userDetailsWithId)
      .pipe(
        tap((response) => {
          console.log('User details updated successfully:', response); // Log the response from backend
        }),
        catchError((error) => {
          console.error('Error updating user details:', error);
          throw error; // Handle errors if any
        })
      );
  }
  
  
}
