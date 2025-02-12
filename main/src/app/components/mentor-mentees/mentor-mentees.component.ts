import { Component, OnInit } from '@angular/core';
import { MentorMenteeService } from 'src/app/services/mentor-mentee.service';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports:[CommonModule],
  selector: 'app-mentor-mentees',
  templateUrl: './mentor-mentees.component.html',
  styleUrls: ['./mentor-mentees.component.css']
})
export class MentorMenteesComponent implements OnInit {
  mentorMentees: any[] = [];

  constructor(private mentorMenteeService: MentorMenteeService) {}

  ngOnInit(): void {
    this.mentorMenteeService.getMentorMentees().subscribe(
      (data) => {
        console.log('Fetched Data:', data); // Debugging output
        this.mentorMentees = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  
}
