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
  
  // Edit state
  isEditMode: boolean = false;
  editingEmployeeId: string | null = null;
  
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
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]], // Password optional in edit mode
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
    if (this.isFormVisible) {
      // Closing the form
      this.isFormVisible = false;
      this.resetForm();
    } else {
      // Opening the form for new employee
      this.isFormVisible = true;
      this.resetForm(); // Ensure it's in create mode
    }
  }

  openNewEmployeeForm(): void {
    if (this.isFormVisible && !this.isEditMode) {
      // Close form if it's already open for new employee
      this.isFormVisible = false;
      this.resetForm();
    } else {
      // Open form for new employee
      this.isFormVisible = true;
      this.resetForm(); // This will set isEditMode to false
    }
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.selectedParentDeptId = null;
    this.childDepartments = [];
    this.isEditMode = false;
    this.editingEmployeeId = null;
    this.initializeForm(); // Re-initialize form to reset password validation
  }

  /**
   * Open form for editing an employee
   */
  editEmployee(employee: IEmployee): void {
    this.isEditMode = true;
    this.editingEmployeeId = employee._id;
    this.isFormVisible = true;
    
    // Load the department's child departments first
    const selectedDept = this.parentDepartments.find(dept => dept.departmentName === employee.department);
    if (selectedDept) {
      this.selectedParentDeptId = selectedDept.departmentId;
      this.loadChildDepartments(this.selectedParentDeptId).then(() => {
        // Populate the form with employee data
        this.employeeForm.patchValue({
          employeeName: employee.employeeName,
          contactNo: employee.contactNo,
          email: employee.email,
          gender: employee.gender,
          department: employee.department,
          subDepartment: employee.subDepartment,
          username: employee.user?.username || ''
          // Password is left empty intentionally
        });
      });
    } else {
      // If department not found, just populate the form
      this.employeeForm.patchValue({
        employeeName: employee.employeeName,
        contactNo: employee.contactNo,
        email: employee.email,
        gender: employee.gender,
        department: employee.department,
        subDepartment: employee.subDepartment,
        username: employee.user?.username || ''
      });
    }
    
    // Re-initialize form to update password validation
    this.initializeForm();
    // Re-patch values after re-initialization
    this.employeeForm.patchValue({
      employeeName: employee.employeeName,
      contactNo: employee.contactNo,
      email: employee.email,
      gender: employee.gender,
      department: employee.department,
      subDepartment: employee.subDepartment,
      username: employee.user?.username || ''
    });
  }

  /**
   * Load child departments and return a promise
   */
  private loadChildDepartments(parentDeptId: number): Promise<void> {
    return new Promise((resolve) => {
      this.masterService.getAllChildDeptBy(parentDeptId).subscribe({
        next: (res: IApiResponse) => {
          if (res.result && res.data) {
            this.childDepartments = res.data;
          }
          resolve();
        },
        error: (err) => {
          console.error('Error loading sub-departments:', err);
          resolve();
        }
      });
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      this.toastr.warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    this.isLoading = true;
    
    if (this.isEditMode && this.editingEmployeeId) {
      // Update existing employee
      const updateData: Partial<IEmployeeCreateRequest> = { ...this.employeeForm.value };
      
      // Remove password if it's empty (don't update password)
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }
      
      // Remove username from update if it's the same or empty
      if (!updateData.username || updateData.username.trim() === '') {
        delete updateData.username;
      }

      this.employeeService.updateEmployee(this.editingEmployeeId, updateData).subscribe({
        next: (response: IEmployee) => {
          this.toastr.success('Employee updated successfully!', 'Success');
          this.resetForm();
          this.isFormVisible = false;
          this.loadEmployees(); // Refresh the list
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          let errorMessage = 'Failed to update employee';
          
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          
          this.toastr.error(errorMessage, 'Error');
          this.isLoading = false;
        }
      });
    } else {
      // Create new employee
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
          this.resetForm();
          this.isFormVisible = false;
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
