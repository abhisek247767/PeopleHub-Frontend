import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { IEmployee, IProject, IUser } from '../../model/interface/master';
import { ProjectService, IProjectCreateRequest, IProjectCreateResponse } from '../../project.service';
import { EmployeeService } from '../../employee.service';

@Component({
  selector: 'app-project',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  showDeleteModal: boolean = false;
  isDarkMode: boolean = false;
  projectToDelete: IProject | null = null;
  projectForm!: FormGroup;
  projects: IProject[] = [];
  employees: IEmployee[] = [];
  filteredEmployees: IEmployee[] = [];
  showForm = false;
  isLoading = false;
  isEditMode = false;
  editingProjectId: string | null = null;

  // Search states
  deliveryManagerSearch = '';
  managerSearch = '';
  leadSearch = '';
  developersSearch = '';
  showDeliveryManagerDropdown = false;
  showManagerDropdown = false;
  showLeadDropdown = false;
  showDevelopersDropdown = false;

  // Filtered employee arrays for real-time search
  filteredDeliveryManagers: IEmployee[] = [];
  filteredManagers: IEmployee[] = [];
  filteredLeads: IEmployee[] = [];
  filteredDevelopersForSearch: IEmployee[] = [];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalProjects: number = 0;
  itemsPerPage: number = 50;

  // Filter state
  filters = {
    status: '',
    priority: '',
    manager: '',
    lead: ''
  };

  projectService = inject(ProjectService);
  employeeService = inject(EmployeeService);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initializeForm();
    this.loadProjects();
    this.loadEmployees();
    this.detectDarkMode();

  }

  detectDarkMode(): void {
    // Detect dark mode by checking body or a global class
    this.isDarkMode = document.body.classList.contains('dark-mode');
    // Optionally, listen for changes
    const observer = new MutationObserver(() => {
      this.isDarkMode = document.body.classList.contains('dark-mode');
      this.cdr.detectChanges();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectDescription: ['', [Validators.required, Validators.minLength(10)]],
      deliveryManager: ['', Validators.required],
      manager: ['', Validators.required],
      lead: ['', Validators.required],
      developers: [[], Validators.required],
      startDate: [''],
      endDate: [''],
      priority: ['medium', Validators.required],
      budget: ['', [Validators.min(0)]],
      // Add search fields as form controls to avoid ngModel conflicts
      deliveryManagerSearch: [''],
      managerSearch: [''],
      leadSearch: [''],
      developersSearch: ['']
    });
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getProjects(this.currentPage, this.itemsPerPage, this.filters).subscribe({
      next: (response: any) => {
        if (response.projects) {
          this.projects = response.projects;
          this.currentPage = response.currentPage || 1;
          this.totalPages = response.totalPages || 1;
          this.totalProjects = response.totalProjects || 0;
        } else {
          this.projects = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.toastr.error(err.error?.message || 'Failed to load projects', 'Error');
        this.projects = [];
        this.isLoading = false;
      }
    });
  }

  loadEmployees(): void {
    this.projectService.getAvailableEmployees().subscribe({
      next: (response: any) => {
        if (response.employees) {
          // Clean up employee data to ensure proper user_id format
          this.employees = response.employees.map((emp: any) => {
            const cleanedEmp = {
              ...emp,
              user_id: this.cleanUserId(emp.user_id),
              _id: this.cleanUserId(emp._id)
            };

            // Use the cleaned user_id as the primary identifier
            if (cleanedEmp.user_id && !cleanedEmp._id) {
              cleanedEmp._id = cleanedEmp.user_id;
            } else if (!cleanedEmp.user_id && cleanedEmp._id) {
              cleanedEmp.user_id = cleanedEmp._id;
            }

            return cleanedEmp;
          });
          this.filteredEmployees = [...this.employees];
          
          // Initialize filtered arrays for real-time search
          this.initializeFilteredArrays();
          
          console.log('Loaded and cleaned employees:', this.employees);
        } else {
          this.employees = [];
          this.filteredEmployees = [];
          this.initializeFilteredArrays();
        }
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.toastr.error('Failed to load employees for project assignment', 'Error');
      }
    });
  }

  initializeFilteredArrays(): void {
    this.filteredDeliveryManagers = [...this.employees];
    this.filteredManagers = [...this.employees];
    this.filteredLeads = [...this.employees];
    this.filteredDevelopersForSearch = [...this.employees];
    console.log('Initialized filtered arrays with', this.employees.length, 'employees');
  }

  // Real-time search functionality
  filterEmployeesByRole(searchTerm: string, role: 'deliveryManager' | 'manager' | 'lead' | 'developers'): IEmployee[] {
    let excludeIds: string[] = [];
    
    // For developers, exclude already selected ones
    if (role === 'developers') {
      excludeIds = this.getSelectedDeveloperIds();
    }

    if (!searchTerm.trim()) {
      return this.employees.filter(emp => !excludeIds.includes(emp.user_id));
    }

    const term = searchTerm.toLowerCase();
    return this.employees.filter(emp =>
      !excludeIds.includes(emp.user_id) &&
      (emp.employeeName.toLowerCase().includes(term) ||
       emp.email.toLowerCase().includes(term) ||
       (emp.user?.username && emp.user.username.toLowerCase().includes(term)))
    );
  }

  onDeliveryManagerSearchChange(event: any): void {
    const value = event.target.value;
    this.deliveryManagerSearch = value;
    this.projectForm.patchValue({ deliveryManagerSearch: value });
    console.log('Delivery Manager Search:', this.deliveryManagerSearch);
    
    // Use setTimeout to ensure the value is properly set before filtering
    setTimeout(() => {
      this.filteredDeliveryManagers = this.filterEmployeesByRole(this.deliveryManagerSearch, 'deliveryManager');
      console.log('Filtered results:', this.filteredDeliveryManagers.length);
      this.showDeliveryManagerDropdown = true;
      this.cdr.detectChanges();
    }, 0);
  }

  onManagerSearchChange(event: any): void {
    const value = event.target.value;
    this.managerSearch = value;
    this.projectForm.patchValue({ managerSearch: value });
    console.log('Manager Search:', this.managerSearch);
    
    setTimeout(() => {
      this.filteredManagers = this.filterEmployeesByRole(this.managerSearch, 'manager');
      this.showManagerDropdown = true;
      this.cdr.detectChanges();
    }, 0);
  }

  onLeadSearchChange(event: any): void {
    const value = event.target.value;
    this.leadSearch = value;
    this.projectForm.patchValue({ leadSearch: value });
    console.log('Lead Search:', this.leadSearch);
    
    setTimeout(() => {
      this.filteredLeads = this.filterEmployeesByRole(this.leadSearch, 'lead');
      this.showLeadDropdown = true;
      this.cdr.detectChanges();
    }, 0);
  }

  onDevelopersSearchChange(event: any): void {
    const value = event.target.value;
    this.developersSearch = value;
    this.projectForm.patchValue({ developersSearch: value });
    console.log('Developers Search:', this.developersSearch);
    
    setTimeout(() => {
      this.filteredDevelopersForSearch = this.filterEmployeesByRole(this.developersSearch, 'developers');
      this.showDevelopersDropdown = true;
      this.cdr.detectChanges();
    }, 0);
  }

  // Handle focus events to show dropdowns
  onDeliveryManagerFocus(): void {
    this.filteredDeliveryManagers = this.filterEmployeesByRole(this.deliveryManagerSearch, 'deliveryManager');
    this.showDeliveryManagerDropdown = true;
  }

  onManagerFocus(): void {
    this.filteredManagers = this.filterEmployeesByRole(this.managerSearch, 'manager');
    this.showManagerDropdown = true;
  }

  onLeadFocus(): void {
    this.filteredLeads = this.filterEmployeesByRole(this.leadSearch, 'lead');
    this.showLeadDropdown = true;
  }

  onDevelopersFocus(): void {
    this.filteredDevelopersForSearch = this.filterEmployeesByRole(this.developersSearch, 'developers');
    this.showDevelopersDropdown = true;
  }

  onBlurDeliveryManager(): void {
    // Delay hiding to allow selection click
    setTimeout(() => {
      if (!document.activeElement || !document.activeElement.classList.contains('dropdown-item')) {
        this.showDeliveryManagerDropdown = false;
      }
    }, 250);
  }

  onBlurManager(): void {
    // Delay hiding to allow selection click
    setTimeout(() => {
      if (!document.activeElement || !document.activeElement.classList.contains('dropdown-item')) {
        this.showManagerDropdown = false;
      }
    }, 250);
  }

  onBlurLead(): void {
    // Delay hiding to allow selection click
    setTimeout(() => {
      if (!document.activeElement || !document.activeElement.classList.contains('dropdown-item')) {
        this.showLeadDropdown = false;
      }
    }, 250);
  }

  onBlurDevelopers(): void {
    // Delay hiding to allow selection click
    setTimeout(() => {
      if (!document.activeElement || !document.activeElement.classList.contains('dropdown-item')) {
        this.showDevelopersDropdown = false;
      }
    }, 250);
  }

  // Helper methods for template
  getSelectedDeveloperIds(): string[] {
    return this.getSelectedDevelopers().map(d => d.user_id);
  }

  getFilteredDevelopers(): IEmployee[] {
    return this.filteredDevelopersForSearch;
  }

  selectDeliveryManager(employee: IEmployee): void {
    console.log('Selecting delivery manager:', employee);
    this.projectForm.patchValue({ 
      deliveryManager: employee.user_id,
      deliveryManagerSearch: employee.employeeName 
    });
    this.deliveryManagerSearch = employee.employeeName;
    this.showDeliveryManagerDropdown = false;
    
    console.log('Updated form and search field:', this.deliveryManagerSearch);
  }

  selectManager(employee: IEmployee): void {
    console.log('Selecting manager:', employee);
    this.projectForm.patchValue({ 
      manager: employee.user_id,
      managerSearch: employee.employeeName 
    });
    this.managerSearch = employee.employeeName;
    this.showManagerDropdown = false;
  }

  selectLead(employee: IEmployee): void {
    console.log('Selecting lead:', employee);
    this.projectForm.patchValue({ 
      lead: employee.user_id,
      leadSearch: employee.employeeName 
    });
    this.leadSearch = employee.employeeName;
    this.showLeadDropdown = false;
  }

  toggleDeveloper(employee: IEmployee): void {
    const currentDevelopers = this.projectForm.get('developers')?.value || [];
    const employeeId = employee.user_id;

    let updatedDevelopers;
    if (currentDevelopers.includes(employeeId)) {
      // Remove developer
      updatedDevelopers = currentDevelopers.filter((id: string) => id !== employeeId);
    } else {
      // Add developer
      updatedDevelopers = [...currentDevelopers, employeeId];
    }

    this.projectForm.patchValue({ developers: updatedDevelopers });
    
    // Clear the search field and update filtered list to exclude selected developers
    this.developersSearch = '';
    this.filteredDevelopersForSearch = this.filterEmployeesByRole('', 'developers');
  }

  isDeveloperSelected(employeeId: string): boolean {
    const currentDevelopers = this.projectForm.get('developers')?.value || [];
    return currentDevelopers.includes(employeeId);
  }

  getSelectedDevelopers(): IEmployee[] {
    const currentDevelopers = this.projectForm.get('developers')?.value || [];
    return this.employees.filter(emp => currentDevelopers.includes(emp.user_id));
  }

  removeDeveloper(employeeId: string): void {
    const currentDevelopers = this.projectForm.get('developers')?.value || [];
    const updatedDevelopers = currentDevelopers.filter((id: string) => id !== employeeId);
    this.projectForm.patchValue({ developers: updatedDevelopers });
    
    // Refresh the developers search list to include the removed developer
    this.filteredDevelopersForSearch = this.filterEmployeesByRole(this.developersSearch, 'developers');
  }

  closeAllDropdowns(): void {
    this.showDeliveryManagerDropdown = false;
    this.showManagerDropdown = false;
    this.showLeadDropdown = false;
    this.showDevelopersDropdown = false;
  }

  private cleanUserId(id: any): string {
    if (!id) return '';

    // Handle cases where id might be an object or malformed string
    if (typeof id === 'object') {
      if (id._id) return id._id.toString();
      if (id.$oid) return id.$oid.toString();
      return id.toString();
    }

    // Handle malformed string formats
    const idStr = id.toString();

    // Pattern like "0: '688a5bd17bf7a83b4c14c960'" or "1: '688a5bd17bf7a83b4c14c960'"
    let match = idStr.match(/\d+:\s*['"]([a-f0-9]{24})['"]$/);
    if (match) {
      return match[1];
    }

    // Pattern like "'688a5bd17bf7a83b4c14c960'"
    match = idStr.match(/^['"]([a-f0-9]{24})['"]$/);
    if (match) {
      return match[1];
    }

    // Pattern like "688a5bd17bf7a83b4c14c960" (already clean)
    if (/^[a-f0-9]{24}$/i.test(idStr)) {
      return idStr;
    }

    console.warn('Could not clean user ID:', idStr);
    return idStr;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      this.toastr.warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    this.isLoading = true;

    const rawFormData = this.projectForm.value;
    const formData: IProjectCreateRequest = {
      projectName: rawFormData.projectName,
      projectDescription: rawFormData.projectDescription,
      deliveryManager: this.cleanUserId(rawFormData.deliveryManager),
      manager: this.cleanUserId(rawFormData.manager),
      lead: this.cleanUserId(rawFormData.lead),
      developers: (rawFormData.developers || []).map((dev: any) => this.cleanUserId(dev)),
      startDate: rawFormData.startDate,
      endDate: rawFormData.endDate,
      priority: rawFormData.priority,
      budget: rawFormData.budget
    };

    console.log('Cleaned form data before sending:', formData);

    if (this.isEditMode && this.editingProjectId) {
      // Update existing project
      this.projectService.updateProject(this.editingProjectId, formData).subscribe({
        next: (project: IProject) => {
          this.toastr.success('Project updated successfully!', 'Success');
          this.closeForm();
          this.loadProjects();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating project:', err);
          this.toastr.error(err.error?.message || 'Failed to update project', 'Error');
          this.isLoading = false;
        }
      });
    } else {
      // Create new project
      this.projectService.createProject(formData).subscribe({
        next: (response: IProjectCreateResponse) => {
          this.toastr.success('Project created successfully!', 'Success');
          this.closeForm();
          this.loadProjects();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error creating project:', err);
          this.toastr.error(err.error?.message || 'Failed to create project', 'Error');
          this.isLoading = false;
        }
      });
    }
  }

  editProject(project: IProject): void {
    this.isEditMode = true;
    this.editingProjectId = project._id;
    this.showForm = true;

    // Populate form with project data
    this.projectForm.patchValue({
      projectName: project.projectName,
      projectDescription: project.projectDescription,
      deliveryManager: project.deliveryManager,
      manager: project.manager,
      lead: project.lead,
      developers: project.developers,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      priority: project.priority,
      budget: project.budget
    });

    // Populate search fields with employee data
    this.deliveryManagerSearch = this.getEmployeeName(project.deliveryManager);
    this.managerSearch = this.getEmployeeName(project.manager);
    this.leadSearch = this.getEmployeeName(project.lead);
    
    // Update search form controls as well
    this.projectForm.patchValue({
      deliveryManagerSearch: this.deliveryManagerSearch,
      managerSearch: this.managerSearch,
      leadSearch: this.leadSearch,
      developersSearch: ''
    });
    
    // Initialize filtered arrays for search
    this.initializeFilteredArrays();
  }

  deleteProject(project: IProject): void {
    this.projectToDelete = project;
    this.showDeleteModal = true;
  }

  confirmDeleteProject(): void {
    if (this.projectToDelete) {
      this.projectService.deleteProject(this.projectToDelete._id).subscribe({
        next: (response) => {
          this.toastr.success('Project deleted successfully', 'Success');
          this.loadProjects();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          this.toastr.error(err.error?.message || 'Failed to delete project', 'Error');
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.projectToDelete = null;
  }

  openForm(): void {
    this.isEditMode = false;
    this.editingProjectId = null;
    this.showForm = true;
    this.projectForm.reset();
    this.projectForm.patchValue({ 
      priority: 'medium',
      deliveryManagerSearch: '',
      managerSearch: '',
      leadSearch: '',
      developersSearch: ''
    });

    // Reset search fields
    this.deliveryManagerSearch = '';
    this.managerSearch = '';
    this.leadSearch = '';
    this.developersSearch = '';
    this.closeAllDropdowns();
    
    // Initialize filtered arrays
    this.initializeFilteredArrays();
    
    // Force UI update
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditMode = false;
    this.editingProjectId = null;
    this.projectForm.reset();

    // Reset search fields
    this.deliveryManagerSearch = '';
    this.managerSearch = '';
    this.leadSearch = '';
    this.developersSearch = '';
    this.closeAllDropdowns();
    
    // Reset filtered arrays
    this.initializeFilteredArrays();
    
    // Force UI update
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  onDeveloperChange(event: any): void {
    const selectedValues = Array.from(event.target.selectedOptions, (option: any) => option.value);
    this.projectForm.patchValue({ developers: selectedValues });
  }

  getEmployeeName(userId: string): string {
    const employee = this.employees.find(emp => emp.user_id === userId || emp._id === userId);
    return employee ? employee.employeeName : 'Unknown Employee';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'planning': return 'badge bg-secondary';
      case 'in-progress': return 'badge bg-primary';
      case 'on-hold': return 'badge bg-warning';
      case 'completed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'low': return 'badge bg-info';
      case 'medium': return 'badge bg-primary';
      case 'high': return 'badge bg-warning';
      case 'critical': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

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
    return this.projectForm.controls;
  }
}
