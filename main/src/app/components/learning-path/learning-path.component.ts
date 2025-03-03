import { Component, OnInit } from '@angular/core';
import { LearningPathService } from '../../services/learning-path.service';
import { CommonModule } from '@angular/common';
import { LearningPath } from 'src/app/models/learning-path.model';

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

    // Check if the learning path is already added
    this.learningPathService.getLearningPathStatus(this.userId).subscribe(
      (response) => {
        this.learningPathStatus = response || []; // Ensure learningPathStatus is an array
        const isAlreadyAdded = this.learningPathStatus.some((lp: any) => lp.learningPathId === this.selectedPath.id);

        if (isAlreadyAdded) {
          this.showNotificationMessage(`${this.selectedPath.title} is already added to learning path`); // Show notification
          this.closeModal();
        } else {
          this.addNewLearningPathStatus();
        }
      },
      (error) => {
        // If there's an error fetching the learning path status, assume it's empty and allow addition
        console.error('Error fetching learning path status:', error);
        this.addNewLearningPathStatus();
      }
    );
  }

  addNewLearningPathStatus(): void {
    const status = 'enrolled'; // Define the status to be added
    const learningPathStatus = {
      userId: this.userId,
      learningPathId: this.selectedPath.id,
      status: status,
      title: this.selectedPath.title,
      description: this.selectedPath.description,
      link: this.selectedPath.link,
      createdAt: new Date().toISOString(),
      subtopics: this.selectedPath.subtopics // Include subtopics
    };

    this.learningPathService
      .addLearningPathStatus(
        this.userId,
        this.selectedPath,
        learningPathStatus
      )
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
      subtopics: this.selectedPath.subtopics // Include subtopics
    };

    this.learningPathService
      .addLearningPathStatus(
        this.userId,
        this.selectedPath.id,
        learningPathStatus
      )
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
        this.learningPathStatus = response || []; // Ensure learningPathStatus is an array
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
