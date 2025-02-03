import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-poc-projects',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './poc-projects.component.html',
  styleUrls: ['./poc-projects.component.css']
})
export class PocProjectsComponent {
  pocForm: FormGroup;
  pocs: Array<any> = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.pocForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['inProgress', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.pocForm.valid) {
      const newPoc = this.pocForm.value;
      this.http.post('http://localhost:5180/api/userdata/addPocProject', newPoc).subscribe(
        (response) => {
          console.log('PoC Project added successfully', response);
          this.pocs.push({
            ...newPoc,
            endDate: newPoc.status === 'completed' ? newPoc.endDate : null
          });
          this.pocForm.reset({
            status: 'inProgress',
            startDate: '',
            endDate: ''
          });
        },
        (error) => {
          console.error('Error adding PoC Project', error);
        }
      );
    }
  }
}