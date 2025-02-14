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
    interns: User[] = [];
    errorMessage: any;
    selectedInterns: { [mentorId: string]: string[] } = {};

    constructor(@Inject(UserService) private userService: UserService) { }

    ngOnInit(): void {
        this.getMentors();
        this.getInterns();
    }

    getMentors(): void {
        this.userService.getMentors().subscribe(
            (data: User[]) => {
                this.mentors = data.map(mentor => ({
                    id: mentor.id,
                    username: mentor.username,
                    email: mentor.email,
                    role: mentor.role
                }));
            },
            (error: any) => {
                console.error('Error fetching mentor data:', error);
            }
        );
    }

    getInterns(): void {
        this.userService.getInterns().subscribe(
            (data: User[]) => {
                this.interns = data;
            },
            (error: any) => {
                console.error('Error fetching intern data:', error);
            }
        );
    }

    onCheckboxChange(event: any, mentorId: string): void {
        if (!this.selectedInterns[mentorId]) {
            this.selectedInterns[mentorId] = [];
        }
        if (event.target.checked) {
            this.selectedInterns[mentorId].push(event.target.value);
        } else {
            this.selectedInterns[mentorId] = this.selectedInterns[mentorId].filter(id => id !== event.target.value);
        }
    }

    assignInternsToMentor(mentorId: string): void {
        const internIds = this.selectedInterns[mentorId] || [];
        this.userService.assignInternsToMentor(mentorId, internIds).subscribe(
            () => {
                console.log('Interns assigned successfully');
            },
            (error: any) => {
                console.error('Error assigning interns:', error);
            }
        );
    }
}
