import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string | null = null;

  totalEmployees = 0;
  totalProjects = 0;
  assignedEmployees = 0;
  benchEmployees = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserName();         // first time /me call happens here
    this.fetchDashboardCounts();
  }

  loadUserName() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.userName = null;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{_id: string; username: string }>(`${environment.apiUrl}/me`, {
      headers,
      withCredentials: true
    }).subscribe({
      next: (data) => {
        this.userName = data.username;

        localStorage.setItem('userId', data._id);
        localStorage.setItem('username', data.username);
      },
      error: (err) => {
        console.error('Failed to load username', err);
        this.userName = null;

        // clear local storage if failed
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
      }
    });
  }

  fetchDashboardCounts() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.userName = null;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`${environment.apiUrl}/dashboard/stats`, {
      headers,
      withCredentials: true
    }).subscribe({
      next: (data) => {
        this.totalEmployees = data.totalEmployees;
        this.totalProjects = data.totalProjects;
        this.assignedEmployees = data.assignedEmployees;
        this.benchEmployees = data.benchEmployees;
      },
      error: (err) => {
        console.error('Failed to fetch dashboard counts', err);
      }
    });
  }
}
