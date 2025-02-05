import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module'; // Import MaterialModule here
import { CommonModule } from '@angular/common'; // Import CommonModule here
import { LearningPathComponent } from 'src/app/components/learning-path/learning-path.component';
import {GoalsComponent} from 'src/app/components/goals/goals.component';
import { PocProjectsComponent } from 'src/app/components/poc-projects/poc-projects.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    PocProjectsComponent,
    GoalsComponent,
    // Import MaterialModule here
    // Import CommonModule here
    // Import TablerIconsModule here
    LearningPathComponent,
    FormsModule,
    MaterialModule,
    ProfileComponent,
    
    CommonModule
    
    
  ],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { }