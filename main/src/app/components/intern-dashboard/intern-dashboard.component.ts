import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardcComponent } from '../dashboardc/dashboardc.component';

@Component({
    selector: 'app-intern-dashboard',
    standalone: true,
    imports: [CommonModule, DashboardcComponent],
    templateUrl: './intern-dashboard.component.html',
    styleUrls: ['./intern-dashboard.component.css']
})
export class InternDashboardComponent implements OnInit {
    userId: string = '';

    ngOnInit(): void {
        this.userId = localStorage.getItem('userId') || '';
    }
}
