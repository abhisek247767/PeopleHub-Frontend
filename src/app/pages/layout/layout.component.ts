import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/service/auth.service';
import { FooterComponent } from '../footer/footer.component'; 
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FooterComponent], // Add FooterComponent
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  userName: string | null = null;
  userAvatar: string | null = null;
  errorMessage: string = '';
  currentTheme: string = 'light';
  greeting: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  get logoPath(): string {
    return this.currentTheme === 'dark'
      ? 'assets/img/logo-dark.svg'
      : 'assets/img/logo-light.svg';
  }

  ngOnInit(): void {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentTheme = savedTheme;
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');

    // Set greeting based on current time
    this.setGreeting();

    // Fetch fresh user data
    this.loadUserData();
  }

  setGreeting(): void {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      this.greeting = 'Good morning';
    } else if (currentHour < 17) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

  loadUserData(): void {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.http.get<{ username: string; profilePicture?: string; _id?: string }>(
      `${environment.apiUrl}/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    ).subscribe({
      next: (data) => {
        this.userName = data.username;

        if (data._id && data.profilePicture) {
          // Add timestamp to bust cache
          this.userAvatar = `http://localhost:3000/profile-picture/${data._id}?t=${Date.now()}`;
        } else {
          this.userAvatar = null;
        }
      },
      error: (err) => {
        console.error('Failed to fetch user data', err);
        this.errorMessage = 'Failed to load user data';
      }
    });
  }

  getFirstLetter(name: string | null): string {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  }

  onAvatarError(): void {
    this.userAvatar = null;
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    document.body.classList.toggle('dark-mode', this.currentTheme === 'dark');
  }

  goToSettings(): void {
    this.router.navigate(['/setting']);
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('role');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.errorMessage = 'Logout failed. Please try again.';
      },
    });
  }
}