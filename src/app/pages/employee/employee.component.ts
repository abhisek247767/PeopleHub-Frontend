import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { IApiResponse, IChildDept, IParentDept } from '../../model/interface/master';
import { MasterService } from './../../service/master.service';
import { EmployeeService } from '../../employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  isFormVisible: boolean = false;
  employeeForm!: FormGroup;
  employees: any[] = [];
  isLoading: boolean = false;

  masterService = inject(MasterService);
  employeeService = inject(EmployeeService);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployees();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      employeeName: ['', [Validators.required, Validators.minLength(3)]],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      department: ['', Validators.required],
      subDepartment: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (res: any) => {
        this.employees = res.employees || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load employees', 'Error');
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.employeeForm.reset();
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      this.toastr.warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    this.isLoading = true;
    this.employeeService.addEmployee(this.employeeForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Employee added successfully', 'Success');
        this.employeeForm.reset();
        this.isFormVisible = false;
        this.loadEmployees();
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Failed to add employee', 'Error');
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get f() { return this.employeeForm.controls; }
}
