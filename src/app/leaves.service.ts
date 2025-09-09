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
  
  private getAuthToken(): string {
    // console.log(sessionStorage.getItem('authToken'));
  return sessionStorage.getItem('authToken') || localStorage.getItem('authToken') || '';
  }

  getLeaveBalance(): Observable<any> {
const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`,
        });
    // On backend get this error 'Token expired and no refresh token provided' to resolve this I add credentials to headers
    const options = {
      headers: headers,
      withCredentials: true,
    }; 

    return this.http.get(`${this.apiUrl}/employees/${userId}/leaves`,  options);
  }

  getEmails(): Observable<string[]> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    // On backend get this error 'Token expired and no refresh token provided' to resolve this I add credentials to headers
    const options = {
      headers: headers,
      withCredentials: true,
    }; 
    console.log("Here is the options from front-end:", options)
    console.log('Token from getAuthToken() before creating header:', this.getAuthToken());
    return this.http.get<string[]>(`${this.apiUrl}/employees/emails`, options);
  }

  applyLeave(data: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`,
        });
    // On backend get this error 'Token expired and no refresh token provided' to resolve this I add credentials to headers
    const options = {
      headers: headers,
      withCredentials: true,
    }; 
    // return this.http.post(`${this.apiUrl}/apply`, data);
    return this.http.post(`${this.apiUrl}/employees/${userId}/leaves`, data, options);
  }

}
