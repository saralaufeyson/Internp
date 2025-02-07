import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../services/user.service'; // Corrected import path
import { User } from '../models/user.model'; // Corrected import path
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-intern-list',
  templateUrl: './intern-list.component.html',
  styleUrls: ['./intern-list.component.css']
})
export class InternListComponent implements OnInit {
  interns: User[] = [];
errorMessage: any;

  constructor(@Inject(UserService) private userService: UserService) { }

  ngOnInit(): void {
    this.getInterns();
  }

  getInterns(): void {
    this.userService.getInterns().subscribe(
      (data: User[]) => { // Explicitly type the data parameter
        this.interns = data;
      },
      (error: any) => {
        console.error('Error fetching intern data:', error);
      }
    );
  }
}
