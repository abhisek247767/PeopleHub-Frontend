import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { 
  IApiResponse, 
  IChildDept, 
  IParentDept, 
  IEmployee, 
  IEmployeeCreateRequest,
  IEmployeeCreateResponse 
} from '../../model/interface/master';
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
  employees: IEmployee[] = [];
  isLoading: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalEmployees: number = 0;
  itemsPerPage: number = 50;

  parentDepartments: IParentDept[] = [];
  childDepartments: IChildDept[] = [];
  selectedParentDeptId: number | null = null;

  // Filter state
  filters = {
    department: '',
    subDepartment: '',
    gender: ''
  };

  masterService = inject(MasterService);
  employeeService = inject(EmployeeService);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployees();
    this.loadParentDepartments();
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
      username: [''] // Optional field, will be auto-generated if not provided
    });
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees(this.currentPage, this.itemsPerPage, this.filters).subscribe({
      next: (response: any) => {
        if (response.employees) {
          this.employees = response.employees;
          this.currentPage = response.currentPage || 1;
          this.totalPages = response.totalPages || 1;
          this.totalEmployees = response.totalEmployees || 0;
        } else {
          this.employees = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.toastr.error(err.error?.message || 'Failed to load employees', 'Error');
        this.employees = [];
        this.isLoading = false;
      }
    });
  }

  loadParentDepartments(): void {
    this.masterService.getAllDept().subscribe({
      next: (res: IApiResponse) => {
        if (res.result && res.data) {
          this.parentDepartments = res.data;
        } else {
          this.toastr.error('Failed to load departments', 'Error');
        }
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.toastr.error('Failed to load departments', 'Error');
      }
    });
  }

  onParentDepartmentChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedDeptName = selectElement.value;

    const selectedDept = this.parentDepartments.find(dept => dept.departmentName === selectedDeptName);

    if (selectedDept) {
      this.selectedParentDeptId = selectedDept.departmentId;
      this.employeeForm.get('subDepartment')?.setValue('');
      this.childDepartments = [];

      this.masterService.getAllChildDeptBy(this.selectedParentDeptId).subscribe({
        next: (res: IApiResponse) => {
          if (res.result && res.data) {
            this.childDepartments = res.data;
          } else {
            this.toastr.error('Failed to load sub-departments', 'Error');
          }
        },
        error: (err) => {
          console.error('Error loading sub-departments:', err);
          this.toastr.error('Failed to load sub-departments', 'Error');
        }
      });
    } else {
      this.selectedParentDeptId = null;
      this.employeeForm.get('subDepartment')?.setValue('');
      this.childDepartments = [];
    }
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.employeeForm.reset();
      this.selectedParentDeptId = null;
      this.childDepartments = [];
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      this.toastr.warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    this.isLoading = true;
    
    const formData: IEmployeeCreateRequest = this.employeeForm.value;
    
    // Auto-generate username if not provided
    if (!formData.username || formData.username.trim() === '') {
      formData.username = formData.employeeName.toLowerCase().replace(/\s+/g, '');
    }

    this.employeeService.addEmployee(formData).subscribe({
      next: (response: IEmployeeCreateResponse) => {
        const message = response.userCreated 
          ? 'Employee and user account created successfully!' 
          : 'Employee created successfully! (User account already existed)';
        
        this.toastr.success(message, 'Success');
        this.employeeForm.reset();
        this.isFormVisible = false;
        this.selectedParentDeptId = null;
        this.childDepartments = [];
        this.loadEmployees(); // Refresh the list
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating employee:', err);
        let errorMessage = 'Failed to add employee';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.toastr.error(errorMessage, 'Error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Delete employee with confirmation
   */
  deleteEmployee(employee: IEmployee): void {
    if (confirm(`Are you sure you want to delete ${employee.employeeName}? This action cannot be undone.`)) {
      this.employeeService.deleteEmployee(employee._id).subscribe({
        next: (response) => {
          this.toastr.success('Employee deleted successfully', 'Success');
          this.loadEmployees(); // Refresh the list
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          this.toastr.error(err.error?.message || 'Failed to delete employee', 'Error');
        }
      });
    }
  }

  /**
   * Get user role for display
   */
  getUserRole(employee: IEmployee): string {
    return employee.user?.role || 'employee';
  }

  /**
   * Check if current user can perform admin actions
   */
  canPerformAdminActions(): boolean {
    // This should check the current user's role from auth service
    // For now, returning true - you should implement proper role checking
    return true;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get f() { 
    return this.employeeForm.controls; 
  }
}
