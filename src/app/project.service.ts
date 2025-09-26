import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { Observable } from 'rxjs';
import { IProject } from './model/interface/master';

export interface IProjectCreateRequest {
  projectName: string;
  projectDescription: string;
  deliveryManager: string;
  manager: string;
  lead: string;
  developers: string[];
  startDate?: string;
  endDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  budget?: number;
}

export interface IProjectCreateResponse {
  success: boolean;
  message: string;
  project: IProject;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Create a new project (admin only)
   * @param projectData Project creation data
   * @returns Observable with creation response
   */
  createProject(projectData: IProjectCreateRequest): Observable<IProjectCreateResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.post<IProjectCreateResponse>(`${this.apiUrl}/projects`, projectData, { headers });
  }

  /**
   * Get all projects with pagination and filters
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @param filters Filter criteria
   * @returns Observable with projects list
   */
  getProjects(page: number = 1, limit: number = 50, filters?: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.manager) params = params.set('manager', filters.manager);
      if (filters.lead) params = params.set('lead', filters.lead);
    }

    return this.http.get<any>(`${this.apiUrl}/projects`, { headers, params });
  }
  /**
   * Get project by ID
   * @param projectId Project ID
   * @returns Observable with tree-strcutured projects
   */
  getProjectTree(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
    return this.http.get<any>(`${this.apiUrl}/projects/tree`, { headers });
  }
  /**
   * Get project by ID
   * @param projectId Project ID
   * @returns Observable with project data
   */
  getProjectById(projectId: string): Observable<IProject> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.get<IProject>(`${this.apiUrl}/projects/${projectId}`, { headers });
  }

  /**
   * Update project data
   * @param projectId Project ID
   * @param updateData Data to update
   * @returns Observable with updated project
   */
  updateProject(projectId: string, updateData: Partial<IProjectCreateRequest>): Observable<IProject> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.put<IProject>(`${this.apiUrl}/projects/${projectId}`, updateData, { headers });
  }

  /**
   * Delete project (admin only)
   * @param projectId Project ID
   * @returns Observable with deletion result
   */
  deleteProject(projectId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.delete<any>(`${this.apiUrl}/projects/${projectId}`, { headers });
  }

  /**
   * Get projects by user (projects where user is a team member)
   * @param userId User ID
   * @returns Observable with user's projects
   */
  getProjectsByUser(userId: string): Observable<IProject[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.get<IProject[]>(`${this.apiUrl}/projects/user/${userId}`, { headers });
  }

  /**
   * Get available employees for project assignment
   * @returns Observable with employees list
   */
  getAvailableEmployees(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.get<any>(`${this.apiUrl}/employees?limit=1000`, { headers });
  }

  /**
   * Search employees by username or name
   * @param searchTerm Search term
   * @returns Observable with filtered employees
   */
  searchEmployees(searchTerm: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<any>(`${this.apiUrl}/employees/search`, { headers, params });
  }

  /**
   * Get authentication token from storage
   * @returns Auth token string
   */
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
  }
}
