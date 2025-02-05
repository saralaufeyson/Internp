import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
    users: any[] = [];
    errorMessage: string = '';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchUsers();
    }

    fetchUsers(): void {
        this.http.get<any[]>('http://localhost:5180/api/userdata/getAllUsers')
            .subscribe(
                (response) => {
                    this.users = response;
                },
                (error) => {
                    this.errorMessage = 'Error fetching user details. Please try again later.';
                }
            );
    }
}
