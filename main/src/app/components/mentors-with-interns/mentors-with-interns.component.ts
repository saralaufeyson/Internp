import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule], // Import CommonModule
    selector: 'app-mentors-with-interns',
    templateUrl: './mentors-with-interns.component.html',
    styleUrls: ['./mentors-with-interns.component.css']
})
export class MentorsWithInternsComponent implements OnInit {
    mentorsWithInterns: any[] = [];
    errorMessage: string | null = null;

    constructor(private userService: UserService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.getMentorsWithInterns();
    }

    getMentorsWithInterns(): void {
        this.userService.getMentorsWithInterns().subscribe(
            (data: any[]) => {
                console.log('Raw API Response:', data); // Debugging: Check API response

                // Ensure proper binding to correct field names
                this.mentorsWithInterns = data.map(mentor => ({
                    mentorId: mentor.mentorId,
                    mentorName: mentor.mentorName,
                    interns: mentor.interns.map((intern: { internId: any; internName: any; internEmail: any; }) => ({
                        internId: intern.internId,
                        internName: intern.internName,
                        internEmail: intern.internEmail
                    }))
                }));

                console.log('Formatted mentorsWithInterns:', this.mentorsWithInterns); // Debugging

                this.cdr.detectChanges(); // Ensure UI updates properly
            },
            (error: any) => {
                this.errorMessage = 'Error fetching mentors with interns data';
                console.error('API Error:', error);
            }
        );
    }
}
