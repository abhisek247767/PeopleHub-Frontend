import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
const token = sessionStorage.getItem('authToken');

@Component({
  selector: 'app-settings',
  imports: [CommonModule,FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingComponent implements OnInit {
  userData = {
    username: '',
    email: '',
    password: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserData();
  }
  loadUserData() {
    console.log('Loading user data...', this.userData);
this.http.get<{ username: string; email: string }>(
  `${environment.apiUrl}/me`,
  {
    headers: {
      Authorization: `Bearer ${token}`  
    }
  }
).subscribe({
      next: (data) => {
        this.userData.username = data.username;
        this.userData.email = data.email;
        this.userData.password = '********';
      },
      error: (err) => {
        console.error('Error loading user data', err);
      },
    });
  }

  updateUser() {
    const updatePayload = {
      username: this.userData.username,
      password: this.userData.password !== '********' ? this.userData.password : undefined,
    };

    this.http.put(`${environment.apiUrl}/update-profile`, updatePayload, { withCredentials: true }).subscribe({
      next: (res) => {
        alert('Profile updated successfully');
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update profile');
      },
    });
  }
}
