import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MylearnService } from '../../services/mylearn.service'; // Import the service

@Component({
  selector: 'app-mylearn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mylearn.component.html',
  styleUrls: ['./mylearn.component.css']
})
export class MylearnComponent implements OnInit {
  learningStatus: string = 'In Progress'; // Example property
  learningPathStatus: any;

  constructor(private mylearnService: MylearnService) { } // Inject the service

  ngOnInit(): void {
    this.getLearningPathStatus(); // Fetch learning path status on initialization
  }

  getLearningPathStatus(): void {
    const userId = localStorage.getItem('userId') || '';
    this.mylearnService.getLearningPathStatus(userId).subscribe(
      (response) => {
        this.learningPathStatus = response;
        console.log('Learning path status:', this.learningPathStatus);
      },
      (error) => {
        console.error('Error fetching learning path status:', error);
      }
    );
  }
}

