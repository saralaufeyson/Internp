import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MentorService {
    private baseUrl = 'http://localhost:5180/api/Mentor';

    constructor(private http: HttpClient) { }

    getMentorGoals(userId: string): Observable<{ totalGoals: number }> {
        return this.http.get<{ totalGoals: number }>(`${this.baseUrl}/${userId}/total-goals`);
    }

    getPocStats(userId: string): Observable<{ totalPocs: number, inProgressPocs: number, completedPocs: number }> {
        return this.http.get<{ totalPocs: number, inProgressPocs: number, completedPocs: number }>(`${this.baseUrl}/${userId}/poc-project-stats`);
    }

    getInterns(userId: string): Observable<{ id: string, username: string, email: string }[]> {
        return this.http.get<{ id: string, username: string, email: string }[]>(`${this.baseUrl}/${userId}/interns`);
    }

    getInternGoals(userId: string): Observable<{ internsGoals: { userId: string, goalCount: number }[], totalGoals: number }> {
        return this.http.get<{ internsGoals: { userId: string, goalCount: number }[], totalGoals: number }>(`${this.baseUrl}/${userId}/total-goals`);
    }

    getInternLearningPaths(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${userId}/interns-learning-paths`);
    }
}
