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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserName();
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
}
