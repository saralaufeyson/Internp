import { Component, OnInit } from '@angular/core';
import { LearningPathService } from 'src/app/services/learning-path.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mylearn',
  standalone: true,
  templateUrl: './mylearn.component.html',
  imports: [CommonModule],
  styleUrls: ['./mylearn.component.css']
})
export class MylearnComponent implements OnInit {
  setLearningPathId(learningPathId: string): void {
    localStorage.setItem('learningPathId', learningPathId);
    this.learningPathId = learningPathId;
  }
  userId: string = localStorage.getItem('userId') || ''; // Get userId from local storage
  learningPathId: string = localStorage.getItem('learningPathId') || ''; // Get learningPathId from local storage
  learningPathStatus: any;

  constructor(private learningPathService: LearningPathService) { }

  ngOnInit(): void {
    this.getLearningPathStatus();
  }

  addLearningPathStatus(): void {
    this.learningPathService.addLearningPathStatus(this.userId, this.learningPathId).subscribe(
      response => {
        console.log('Learning path status added:', response);
        this.getLearningPathStatus(); // Refresh status after adding
      },
      error => {
        console.error('Error adding learning path status:', error);
      }
    );
  }

  getLearningPathStatus(): void {
    this.learningPathService.getLearningPathStatus(this.userId).subscribe(
      (response: any) => {
        // Ensure the response is an array
        this.learningPathStatus = Array.isArray(response) ? response : [response];

        // Include the id field in the response
        this.learningPathStatus = this.learningPathStatus.map((status: any) => ({
          ...status,
          id: status.id.toString() // Ensure id is included as a string
        }));

        console.log('Learning path status:', this.learningPathStatus);
      },
      (error: any) => {
        console.error('Error fetching learning path status:', error);
      }
    );
  }

  removeLearningPathStatus(learningPathStatusId: string): void {
    this.learningPathService.deleteLearningPathStatus(learningPathStatusId).subscribe(
      response => {
        console.log('Learning path status removed:', response);
        this.getLearningPathStatus(); // Refresh status after removal
      },
      error => {
        console.error('Error removing learning path status:', error);
      }
    );
  }

  toggleSubtopic(learningPathStatusId: string, subtopic: any): void {
    subtopic.completed = !subtopic.completed;
    const learningPath = this.learningPathStatus.find((lp: any) => lp.id === learningPathStatusId);
    const completedSubtopics = learningPath.subtopics.filter((st: any) => st.completed).length;
    const totalSubtopics = learningPath.subtopics.length;
    const progress = (completedSubtopics / totalSubtopics) * 100;
    this.updateProgress(learningPathStatusId, progress);

    // Call the API to update the subtopic status
    this.learningPathService.updateSubtopicStatus(learningPathStatusId, subtopic).subscribe(
      (response) => {
        console.log('Subtopic status updated:', response);
      },
      (error) => {
        console.error('Error updating subtopic status:', error);
      }
    );
  }

  updateProgress(learningPathStatusId: string, progress: number): void {
    progress = Math.round(progress * 10) / 10; // Limit to single decimal point
    this.learningPathService.updateLearningPathProgress(learningPathStatusId, progress).subscribe(
      (response) => {
        console.log('Progress updated:', response);
        this.getLearningPathStatus(); // Refresh status after updating progress
      },
      (error) => {
        console.error('Error updating progress:', error);
      }
    );
  }
}

