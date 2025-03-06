import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GoalsService {
    private apiUrl = `${environment.apiUrl}/goal`;

    constructor(private http: HttpClient) { }

    getGoals(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getGoals/${userId}`);
    }

    addGoal(goalData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/addGoal`, goalData);
    }

    getGoalsCount(userId: string): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.apiUrl}/getGoalsCount/${userId}`);
    }

    deleteGoal(goalId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/deleteGoal/${goalId}`);
    }

    getAllGoals(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getAllGoals`);
    }

    getAllGoalsCount(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.apiUrl}/getAllGoalsCount`);
    }

    getGoalCount(userId: string): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.apiUrl}/getGoalCount/${userId}`);
    }

    updateGoal(goalId: string, goalData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/updateGoal/${goalId}`, goalData);
    }
}
