import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module'; // Import MaterialModule here
import { CommonModule } from '@angular/common'; // Import CommonModule here

import { DashboardcComponent } from 'src/app/components/dashboardc/dashboardc.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [DashboardcComponent, FormsModule, MaterialModule, CommonModule],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { }
