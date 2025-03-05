import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../../services/user.service'; // Corrected import path
import { User } from '../../../models/user.model'; // Corrected import path
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog and MatDialogModule
import { InternDetailsPopupComponent } from './intern-details-popup/intern-details-popup.component'; // Import the new popup component
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  selector: 'app-intern-list',
  templateUrl: './intern-list.component.html',
  styleUrls: ['./intern-list.component.css']
})
export class InternListComponent implements OnInit {
  interns: User[] = [];
  filteredInterns: User[] = [];
  searchQuery: string = '';
  sortOrder: string = 'asc';
  showSearchBar: boolean = false;
  errorMessage: any;

  constructor(@Inject(UserService) private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getInterns();
  }

  getInterns(): void {
    this.userService.getInterns().subscribe(
      (data: User[]) => { // Explicitly type the data parameter
        this.interns = data;
        this.filteredInterns = data;
        this.sortInterns();
      },
      (error: any) => {
        console.error('Error fetching intern data:', error);
      }
    );
  }

  filterInterns(): void {
    this.filteredInterns = this.interns.filter(intern =>
      intern.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      intern.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.sortInterns();
  }

  sortInterns(): void {
    this.filteredInterns.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortInterns();
  }

  toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
  }

  openInternDetails(internId: string): void {
    const dialogRef = this.dialog.open(InternDetailsPopupComponent, {
      width: '800px',
      data: { internId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
