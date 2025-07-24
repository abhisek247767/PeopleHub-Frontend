import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {}

  addEmployee(data: any) {
    return this.http.post(`${environment.apiUrl}/create-employee`, data);
  }
}
