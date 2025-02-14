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

  constructor(private mylearnService: LearningPathService) {}

  ngOnInit(): void {
    this.getLearningPathStatus();
  }

  addLearningPathStatus(): void {
    this.mylearnService.addLearningPathStatus(this.userId, this.learningPathId).subscribe(
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
    this.mylearnService.getLearningPathStatus(this.userId).subscribe(
      (response: any) => {
        // Ensure the response is an array
        this.learningPathStatus = Array.isArray(response) ? response : [response];
  
        console.log('Learning path status:', this.learningPathStatus);
      },
      (error: any) => {
        console.error('Error fetching learning path status:', error);
      }
    );
  }
  
}

