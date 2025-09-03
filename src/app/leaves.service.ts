import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
    private apiUrl = environment.apiUrl;
  

  constructor(private http: HttpClient) { }
getLeaveBalance(): Observable<any> {
const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
    return this.http.get(`${this.apiUrl}/employees/${userId}/leaves`, { headers });
  }

  getEmails(): Observable<string[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
    return this.http.get<string[]>(`${this.apiUrl}/employees/emails`, { headers });
  }

  applyLeave(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, data);
  }

    private getAuthToken(): string {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
  }
}
