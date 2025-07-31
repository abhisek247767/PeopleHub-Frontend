import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingComponent implements OnInit {
  userData = {
    username: '',
    email: '',
    password: '',
    profilePicture: '',
    profilePictureUrl: ''
  };
  profilePictureFile: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  onProfilePictureChange(event: any): void {
    const file = event.target.files[0];
    this.profilePictureFile = file ? file : null;
  }

  loadUserData() {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      console.error('No auth token found');
      return;
    }

    console.log('Loading user data...', this.userData);

    this.http.get<{ username: string; email: string; profilePicture?: string; _id?: string }>(
      `${environment.apiUrl}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    ).subscribe({
      next: (data) => {
        console.log('Logged in user details:', data);
        this.userData.username = data.username;
        this.userData.email = data.email;
        this.userData.password = '********';
        this.userData.profilePicture = data.profilePicture || '';

        if (data._id) {
          sessionStorage.setItem('userId', data._id);
          // Use localhost instead of 127.0.0.1 for consistency
          this.userData.profilePictureUrl = data.profilePicture
            ? `http://localhost:3000/profile-picture/${data._id}?t=${Date.now()}`
            : '';
        } else {
          this.userData.profilePictureUrl = '';
        }
      },
      error: (err) => {
        console.error('Error loading user data', err);
      },
    });
  }

  updateUser() {
    const formData = new FormData();
    formData.append('username', this.userData.username);

    if (this.userData.password !== '********') {
      formData.append('password', this.userData.password);
    }

    if (this.profilePictureFile) {
      formData.append('profilePicture', this.profilePictureFile);
    }

    const token = sessionStorage.getItem('authToken');
    const userId = sessionStorage.getItem('userId') || '';

    if (!token) {
      alert('Authentication required');
      return;
    }

    this.http.put(`${environment.apiUrl}/update-profile`, formData, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res: any) => {
        alert('Profile updated successfully');
        if (res.user && res.user.profilePicture) {
          this.userData.profilePicture = res.user.profilePicture;
          // Add timestamp to force reload of image
          this.userData.profilePictureUrl = `http://localhost:3000/profile-picture/${userId}?t=${Date.now()}`;
        }
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update profile');
      },
    });
  }
}
