import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slearning',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './selectlearning.component.html',
  styleUrls: ['./selectlearning.component.css']
})
export class SelectLearningComponent {
  courses = ['Python', '.NET', 'Angular', 'Mobile Dev', 'Docker', 'GitHub', 'Other'];
  selectedCourse: string = '';
  courseDetails: any[] = [];
  progress: number = 0;

  courseTopics: { [key: string]: { name: string; isChecked: boolean; }[] } = {
    'Python': [
      { name: 'OOPs', isChecked: false },
      { name: 'Constructors', isChecked: false },
      { name: 'File Reading', isChecked: false }
    ],
    '.NET': [
      { name: 'ASP.NET Core', isChecked: false },
      { name: 'C# Basics', isChecked: false },
      { name: 'Entity Framework', isChecked: false }
    ],
    'Angular': [
      { name: 'Components', isChecked: false },
      { name: 'Directives', isChecked: false },
      { name: 'Services', isChecked: false }
    ],
    'Mobile Dev': [
      { name: 'React Native', isChecked: false },
      { name: 'Flutter', isChecked: false },
      { name: 'Android', isChecked: false }
    ],
    'Docker': [
      { name: 'Docker Basics', isChecked: false },
      { name: 'Docker Compose', isChecked: false }
    ],
    'GitHub': [
      { name: 'Basic Git Commands', isChecked: false },
      { name: 'Version Control', isChecked: false }
    ],
    'Other': [
      { name: 'Custom Topic 1', isChecked: false },
      { name: 'Custom Topic 2', isChecked: false }
    ]
  };

  fetchCourseDetails() {
    this.courseDetails = this.courseTopics[this.selectedCourse] || [];
    this.progress = 0;
  }

  updateProgress() {
    const totalTopics = this.courseDetails.length;
    const checkedTopics = this.courseDetails.filter(topic => topic.isChecked).length;
    this.progress = Math.round((checkedTopics / totalTopics) * 100);
  }
}
