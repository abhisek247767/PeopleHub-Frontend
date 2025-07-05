import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse } from '../model/interface/master';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiUrl: string = 'https://projectapi.gerasim.in/api/EmployeeManagement';
  constructor(private http: HttpClient) { }

  getAllDept(): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.apiUrl}/GetParentDepartment`);
  }

  getAllChildDeptBy(deptId : number): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.apiUrl}/GetChildDepartmentByParentId?deptId=${deptId}`);
  }

}
