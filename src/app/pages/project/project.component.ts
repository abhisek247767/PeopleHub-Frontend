import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEmployee, IProject } from '../../model/interface/master';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',
  imports: [    CommonModule,
    ReactiveFormsModule,FormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  projectForm!: FormGroup;
  employees: IEmployee[] = [];
  IProject: any;
  showForm = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      deliveryManager: ['', Validators.required],
      firstManager: ['', Validators.required],
      teamLead: ['', Validators.required],
      developers: [[], Validators.required],
    });
  }

  loadEmployees() {
    this.http.get<IEmployee[]>(`${environment.apiUrl}/employee/list`).subscribe({
      next: (data) => (this.employees = data),
      error: (err) => console.error('Failed to load employees', err),
    });
  }

  submitProject() {
    const projectData: IProject = this.projectForm.value;
    this.http.post(`${environment.apiUrl}/projects`, projectData).subscribe({
      next: () => {
        alert('Project created successfully');
        this.closeForm();
      },
      error: (err) => console.error('Failed to create project', err),
    });
  }

  closeForm() {
    this.showForm = false;
  }
}
