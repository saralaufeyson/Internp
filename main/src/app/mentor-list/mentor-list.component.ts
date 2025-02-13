import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-mentor-list',
    templateUrl: './mentor-list.component.html',
    styleUrls: ['./mentor-list.component.css']
})
export class MentorListComponent implements OnInit {
    mentors: User[] = [];
    errorMessage: any;

    constructor(@Inject(UserService) private userService: UserService) { }

    ngOnInit(): void {
        this.getMentors();
    }

    getMentors(): void {
        this.userService.getMentors().subscribe(
            (data: User[]) => {
                this.mentors = data;
            },
            (error: any) => {
                console.error('Error fetching mentor data:', error);
            }
        );
    }
}
