import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SideLoginComponent } from './side-login.component';

@NgModule({
  declarations: [
    //SideLoginComponent,  // Declare the standalone component
  ],
  imports: [
    CommonModule,       // Common Angular module
    FormsModule,        // For template-driven forms
    ReactiveFormsModule,// For reactive forms
    RouterModule,       // For routing (if you want to use Angular's router)
    MatInputModule,     // Angular Material input
    MatCheckboxModule,  // Angular Material checkbox
    MatButtonModule,    // Angular Material button
    MatFormFieldModule, // Angular Material form field (for mat-label, mat-input)
  ],
})
export class SideLoginModule {}