// src/app/components/learning-path/learning-path.component.ts
import { Component, OnInit } from '@angular/core';
import { LearningPathService} from '../../services/learning-path.service';
import { LearningPath } from '../../services/learning-path.model';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-learning-path',
  imports: [CommonModule], // Import CommonModule
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.css']
})
export class LearningPathComponent implements OnInit {
  learningPaths: LearningPath[] = [];

  constructor(private learningPathService: LearningPathService) { }

  ngOnInit(): void {
    // Fetch the learning paths from the backend when the component loads
    this.learningPathService.getLearningPaths().subscribe(
      (data) => {
        this.learningPaths = data;  // Populate the learningPaths array
      },
      (error) => {
        console.error('Error fetching learning paths:', error);
      }
    );
  }
}