import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule],
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  userId: string = localStorage.getItem('userId') || ''; // Get userId from localStorage
  skills: string[] = [];  // Store user skills
  newSkill: string = '';  // New skill input

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSkills();
  }

  // Fetch user details to get skills
  fetchSkills() {
    this.http.get<any>(`${environment.apiUrl}/UserDetails/${this.userId}`).subscribe({
      next: (response) => {
        this.skills = response.skills || [];
      },
      error: (error) => console.error('Error fetching skills', error)
    });
  }

  // Add a skill
  addSkill() {
    if (!this.newSkill.trim()) return; // Prevent empty input
  
    const skillData = { skill: this.newSkill }; // Wrap in an object
  
    this.http.post(`${environment.apiUrl}/UserDetails/${this.userId}/skills`, skillData, {
      headers: { 'Content-Type': 'application/json' },  // Explicitly set JSON content type
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.skills.push(this.newSkill);
        this.newSkill = ''; // Clear input
      },
      error: (error) => console.error('Error adding skill', error)
    });
  }
  

  // Remove a skill
  removeSkill(skill: string) {
    this.http.delete(`${environment.apiUrl}/UserDetails/${this.userId}/skills/${skill}`)
      .subscribe({
        next: () => {
          this.skills = this.skills.filter(s => s !== skill); // Remove from list
        },
        error: (error) => console.error('Error removing skill', error)
      });
  }
}
