import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { Observable } from 'rxjs';
import { IEmployeeCreateRequest, IEmployeeCreateResponse, IEmployee } from './model/interface/master';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Create a new employee (admin only)
   * @param employeeData Employee creation data
   * @returns Observable with creation response
   */
  addEmployee(employeeData: IEmployeeCreateRequest): Observable<IEmployeeCreateResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.post<IEmployeeCreateResponse>(`${this.apiUrl}/employees`, employeeData, { headers });
  }

  /**
   * Get all employees with pagination and filters
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @param filters Filter criteria
   * @returns Observable with employees list
   */
  getEmployees(page: number = 1, limit: number = 50, filters?: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.department) params = params.set('department', filters.department);
      if (filters.subDepartment) params = params.set('subDepartment', filters.subDepartment);
      if (filters.gender) params = params.set('gender', filters.gender);
    }

    return this.http.get<any>(`${this.apiUrl}/employees`, { headers, params });
  }

  /**
   * Get employee by ID
   * @param employeeId Employee ID
   * @returns Observable with employee data
   */
  getEmployeeById(employeeId: string): Observable<IEmployee> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.get<IEmployee>(`${this.apiUrl}/employees/${employeeId}`, { headers });
  }

  /**
   * Update employee data
   * @param employeeId Employee ID
   * @param updateData Data to update
   * @returns Observable with updated employee
   */
  updateEmployee(employeeId: string, updateData: Partial<IEmployeeCreateRequest>): Observable<IEmployee> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.put<IEmployee>(`${this.apiUrl}/employees/${employeeId}`, updateData, { headers });
  }

  /**
   * Delete employee (admin only)
   * @param employeeId Employee ID
   * @returns Observable with deletion result
   */
  deleteEmployee(employeeId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.delete<any>(`${this.apiUrl}/employees/${employeeId}`, { headers });
  }

  /**
   * Get authentication token from storage
   * @returns Auth token string
   */
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
  }
}
