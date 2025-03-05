import { Component, Inject, OnInit } from '@angular/core';
import { ExperienceService } from '../../../services/experience.service';
import { UserDetailsService } from '../../../services/user-details.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Experience {
  title: string;
  company: string;
  duration: string;
  location: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {
  userId: string = localStorage.getItem('userId') || '';
  experiences: Experience[] = [];
  userDetailsExists: boolean = false;
  showForm: boolean = false;

  newExperience: Experience = {
    title: '',
    company: '',
    duration: '',
    location: ''
  };

  constructor(
    @Inject(ExperienceService) private experienceService: ExperienceService,
    @Inject(UserDetailsService) private userDetailsService: UserDetailsService
  ) {}

  ngOnInit(): void {
    this.checkUserDetails();
    this.getUserExperiences();
  }

  checkUserDetails(): void {
    this.userDetailsService.getUserDetails(this.userId).subscribe(
      (data) => {
        if (data) {
          this.userDetailsExists = true;
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
        this.userDetailsExists = false;
      }
    );
  }

  getUserExperiences(): void {
    this.experienceService.getExperiences(this.userId).subscribe((data) => {
      if (data && data.experiences) {
        this.experiences = data.experiences;
      }
    });
  }

  deleteExperience(index: number): void {
    this.experienceService.deleteExperience(this.userId, index).subscribe(() => {
      this.experiences.splice(index, 1);
    });
  }

  addExperience(): void {
    if (!this.userDetailsExists) {
      alert('Please add your user details first before adding experience.');
      return;
    }

    if (!this.newExperience.title || !this.newExperience.company) {
      alert('Title and Company are required.');
      return;
    }

    this.experienceService.addExperience(this.userId, this.newExperience).subscribe((data) => {
      if (data && data.experiences) {
        this.experiences = data.experiences; // Update the whole experience array
      }
      this.newExperience = { title: '', company: '', duration: '', location: '' }; // Reset form
      this.showForm = false; // Hide form
    });
  }
}