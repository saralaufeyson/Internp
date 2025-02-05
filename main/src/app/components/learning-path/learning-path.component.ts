import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-learning-path',
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.css']
})
export class LearningPathComponent {
  // Define an array of learning paths
  learningPaths = [
    {
      title: 'Microsoft Azure Fundamentals',
      description: 'Learn the basics of Microsoft Azure services and solutions.',
      imageUrl: 'path_to_image_1.jpg',
      link: '/learning-path/azure-fundamentals'
    },
    {
      title: 'Data Science with Python',
      description: 'Learn Python and dive into data analysis, visualization, and machine learning.',
      imageUrl: 'path_to_image_2.jpg',
      link: '/learning-path/data-science-python'
    },
    {
      title: 'Web Development with Angular',
      description: 'Learn how to build modern web applications with Angular.',
      imageUrl: 'path_to_image_3.jpg',
      link: '/learning-path/angular-web-development'
    },
    // Add more learning paths here...
  ];
}
