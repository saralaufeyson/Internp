import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsComponent } from '../goals/goals.component';
import { PocProjectsComponent } from '../poc-projects/poc-projects.component';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true, // Ensure standalone if you're using standalone components
  imports: [CommonModule, GoalsComponent, PocProjectsComponent,  FormsModule], // Import necessary Angular modules
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userProfile = {
    name: 'Layasree',
    email: 'layasree@example.com',
    status: 'Intern',
    joinedDate: new Date('2024-01-10'),
  };

  profileImage: string | ArrayBuffer | null = null;

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
