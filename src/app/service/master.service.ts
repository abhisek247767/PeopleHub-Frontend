import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse } from '../model/interface/master';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

    private apiUrl = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient) { }

  getAllDept(): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.apiUrl}/departments`);
  }

  getAllChildDeptBy(deptId : number): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(
    `${this.apiUrl}/subDepartments?deptId=${deptId}`,
  );
  }
}
