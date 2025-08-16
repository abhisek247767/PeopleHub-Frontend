import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string | null = null;

  // Dashboard Data fetched from `/dashboard/stats` backend
  totalEmployees: number = 0;
  totalProjects: number = 0;
  assignedEmployees: number = 0;
  benchEmployees: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUserName();
    this.fetchDashboardCounts();
  }

  loadUserName() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.userName = null;
      return;
    }

    this.http.get<{ username: string }>(`${environment.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    }).subscribe({
      next: data => this.userName = data.username,
      error: err => {
        console.error('Failed to load username', err);
        this.userName = null;
      }
    });
  }

  fetchDashboardCounts() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.userName = null;
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    })
      .subscribe({
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
