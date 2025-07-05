import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ILoginResponse, IRegisterationResponse } from '../model/interface/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user'); 
  }

  registration(username: string, email: string, password: string, confirmPassword: string): Observable<IRegisterationResponse> {
    return this.http.post<IRegisterationResponse>(`${this.apiUrl}/signup`, {username, email, password, confirmPassword}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    }).pipe(
      tap((response: IRegisterationResponse) => {
        console.log(response.message);
      })
    )
  }

  login(email: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, { email, password }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
      
    }).pipe(
      tap((response: ILoginResponse) => {
        if (response.token) {
          sessionStorage.setItem('authToken', response.token);
        }
      })
    );
  }
  

  logout(): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        console.warn('No auth token found, logging out without token.');
    }
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        }),
        withCredentials: true, 
    });
  }
  


}
