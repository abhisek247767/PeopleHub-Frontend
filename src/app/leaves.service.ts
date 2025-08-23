import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  private apiUrl = 'http://localhost:3000/api/leaves';

  constructor(private http: HttpClient) { }
  getLeaveBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/balance`);
  }

  getEmails(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/emails`);
  }

  applyLeave(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, data);
  }
}
