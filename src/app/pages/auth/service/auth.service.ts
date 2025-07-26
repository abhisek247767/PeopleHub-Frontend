import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ILoginResponse, IRegisterationResponse } from '../model/interface/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;  // Ensure this is 'http://127.0.0.1:3000'

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user'); // You may enhance this later to check session validity
  }

  registration(username: string, email: string, password: string, confirmPassword: string): Observable<IRegisterationResponse> {
    return this.http.post<IRegisterationResponse>(`${this.apiUrl}/signup`, {
      username, email, password, confirmPassword
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true // Important: allows cookies (session) to be sent
    });
  }

  login(email: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, {
      email, password
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }).pipe(
      tap((response: ILoginResponse) => {
        // Only store user if needed; do NOT store token if you're using session-based auth
        sessionStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true // Required to clear the session cookie on the server
    }).pipe(
      tap(() => {
        sessionStorage.removeItem('user');
      })
    );
  }

}
