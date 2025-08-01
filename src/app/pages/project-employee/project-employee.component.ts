import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { IProject, IEmployee } from '../../model/interface/master';
import { ProjectService } from '../../project.service';
import { EmployeeService } from '../../employee.service';

@Component({
  selector: 'app-project-employee',
  imports: [CommonModule],
  templateUrl: './project-employee.component.html',
  styleUrl: './project-employee.component.css'
})
export class ProjectEmployeeComponent implements OnInit {
  projects: IProject[] = [];
  currentEmployee: IEmployee | null = null;
  isLoading = false;
  currentDate = new Date();

  projectService = inject(ProjectService);
  employeeService = inject(EmployeeService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadUserProjects();
  }

  loadUserProjects(): void {
    this.isLoading = true;

    // In a real application, you would get the current user ID from an auth service
    // For now, we'll load all projects and filter by current user
    const currentUserId = this.getCurrentUserId(); // You need to implement this

    if (currentUserId) {
      this.projectService.getProjectsByUser(currentUserId).subscribe({
        next: (projects: IProject[]) => {
          this.projects = projects;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading user projects:', err);
          this.toastr.error('Failed to load your projects', 'Error');
          this.isLoading = false;
        }
      });
    } else {
      // If no user ID available, load all projects (fallback)
      this.loadAllProjects();
    }
  }

  loadAllProjects(): void {
    this.projectService.getProjects(1, 100).subscribe({
      next: (response: any) => {
        this.projects = response.projects || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.toastr.error('Failed to load projects', 'Error');
        this.isLoading = false;
      }
    });
  }

  getUserRole(project: IProject): string {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return 'Unknown';

    if (project.deliveryManager === currentUserId) return 'Delivery Manager';
    if (project.manager === currentUserId) return 'Manager';
    if (project.lead === currentUserId) return 'Team Lead';
    if (project.developers.includes(currentUserId)) return 'Developer';

    return 'Team Member';
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

  getRoleIcon(role: string): string {
    switch (role) {
      case 'Delivery Manager': return 'fas fa-user-tie';
      case 'Manager': return 'fas fa-user-cog';
      case 'Team Lead': return 'fas fa-user-graduate';
      case 'Developer': return 'fas fa-code';
      default: return 'fas fa-user';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Delivery Manager': return 'badge bg-primary';
      case 'Manager': return 'badge bg-info';
      case 'Team Lead': return 'badge bg-success';
      case 'Developer': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  }

  private getCurrentUserId(): string {
    // This should get the current user ID from your auth service
    // For now, returning a placeholder - you need to implement this
    return localStorage.getItem('currentUserId') || '';
  }
}
