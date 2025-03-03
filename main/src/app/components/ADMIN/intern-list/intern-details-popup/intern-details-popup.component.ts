import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { UserDetailsService } from '../../../../services/user-details.service';
import { DashboardcComponent } from '../../../INTERN/intern-dashboard/dashboardc/dashboardc.component';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule, DashboardcComponent, MatDialogModule],
    selector: 'app-intern-details-popup',
    templateUrl: './intern-details-popup.component.html',
    styleUrls: ['./intern-details-popup.component.css']
})
export class InternDetailsPopupComponent implements OnInit {
    userDetails: any;
    userId: string;

    constructor(
        public dialogRef: MatDialogRef<InternDetailsPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService: UserService,
        private userDetailsService: UserDetailsService
    ) {
        this.userId = data.internId;
    }

    ngOnInit(): void {
        this.fetchUserDetails();
    }

    fetchUserDetails(): void {
        this.userDetailsService.getUserDetails(this.userId).subscribe(
            (data: any) => {
                this.userDetails = data;
            },
            (error: any) => {
                console.error('Error fetching user details:', error);
            }
        );
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
