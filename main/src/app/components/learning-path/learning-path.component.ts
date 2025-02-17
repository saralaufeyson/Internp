import { Component, OnInit } from '@angular/core';
import { LearningPathService } from '../../services/learning-path.service';
import { LearningPath } from '../../services/learning-path.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-learning-path',
  imports: [CommonModule],
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.css'],
})
export class LearningPathComponent implements OnInit {
  learningPaths: LearningPath[] = [];
  userId: string = localStorage.getItem('userId') || ''; // Get userId from local storage
  learningPathId: string = localStorage.getItem('learningPathId') || ''; // Get learningPathId from local storage
  learningPathStatus: any;
  showModal = false;
  selectedPath: any;
  showNotification = false;
  notificationMessage = '';

  constructor(private learningPathService: LearningPathService) { }

  ngOnInit(): void {
    this.getLearningPaths();
    this.getStoredLearningPathAndUserId();
  }

  getLearningPaths(): void {
    this.learningPathService.getLearningPaths().subscribe(
      (data) => {
        this.learningPaths = data; // Populate the learningPaths array
      },
      (error) => {
        console.error('Error fetching learning paths:', error);
      }
    );
  }

  addLearningPathStatus(path: any): void {
    this.selectedPath = path;
    console.log('Adding learning path:', path);
    this.showModal = true;

    const status = 'enrolled'; // Define the status to be added
    const learningPathStatus = {
      userId: this.userId,
      learningPathId: this.selectedPath.id,
      status: status,
      title: this.selectedPath.title,
      description: this.selectedPath.description,
      link: this.selectedPath.link,
      createdAt: new Date().toISOString(),
    };

    this.learningPathService
      .addLearningPathStatus(this.userId, learningPathStatus) // Fix method call
      .subscribe(
        (response) => {
          console.log('Learning path status added:', status);
          this.getLearningPathStatus(); // Refresh status after adding
          this.closeModal();
          this.showNotificationMessage(`${this.selectedPath.title} added to learning path`); // Show custom notification
        },
        (error) => {
          console.error('Error adding learning path status:', error);
        }
      );
  }

  closeModal(): void {
    this.showModal = false;
  }

  confirmAddLearningPath(): void {
    if (!this.selectedPath) {
      console.error('No learning path selected');
      return;
    }
    const status = 'enrolled'; // Define the status to be added
    const learningPathStatus = {
      userId: this.userId,
      learningPathId: this.selectedPath.id,
      status: status,
      title: this.selectedPath.title,
      description: this.selectedPath.description,
      link: this.selectedPath.link,
      createdAt: new Date().toISOString(),
    };

    this.learningPathService
      .addLearningPathStatus(this.userId, learningPathStatus) // Fix method call
      .subscribe(
        (response) => {
          console.log('Learning path status added:', status);
          this.getLearningPathStatus(); // Refresh status after adding
          this.closeModal();
        },
        (error) => {
          console.error('Error adding learning path status:', error);
        }
      );
  }

  getLearningPathStatus(): void {
    this.learningPathService.getLearningPathStatus(this.userId).subscribe(
      (response) => {
        this.learningPathStatus = response;
        console.log('Learning path status:', this.learningPathStatus);
        console.log('Type of learningPathStatus:', typeof this.learningPathStatus);
      },
      (error) => {
        console.error('Error fetching learning path status:', error);
      }
    );
  }

  storeLearningPathAndUserId(learningPathId: string): void {
    localStorage.setItem('learningPathId', learningPathId);
    this.learningPathId = learningPathId;
  }

  getStoredLearningPathAndUserId(): {
    learningPathId: string | null;
    userId: string | null;
  } {
    const learningPathId = localStorage.getItem('learningPathId');
    const userId = localStorage.getItem('userId');
    console.log('Learning Path ID:', learningPathId);
    return { learningPathId, userId };
  }

  showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000); // Hide notification after 3 seconds
  }
}
