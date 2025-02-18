import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../services/user.service'; // Corrected import path
import { User } from '../models/user.model'; // Corrected import path
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog and MatDialogModule
import { InternDetailsPopupComponent } from '../intern-details-popup/intern-details-popup.component'; // Import the new popup component

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  selector: 'app-intern-list',
  templateUrl: './intern-list.component.html',
  styleUrls: ['./intern-list.component.css']
})
export class InternListComponent implements OnInit {
  interns: User[] = [];
  errorMessage: any;

  constructor(@Inject(UserService) private userService: UserService, private dialog: MatDialog) { }

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

  openInternDetails(internId: string): void {
    const dialogRef = this.dialog.open(InternDetailsPopupComponent, {
      width: '80%',
      data: { internId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
