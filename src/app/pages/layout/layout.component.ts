import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  private userDetails: any;
  userName: string | null = null;
  errorMessage: string = '';
  currentTheme: string = 'light'; // Dark/Light Theme

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Theme setup
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentTheme = savedTheme;
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');

    // User setup
    const storedUserData = sessionStorage.getItem('user');
    if (storedUserData) {
      this.userDetails = JSON.parse(storedUserData);
      this.userName = this.userDetails?.username ?? null;
    } else {
      this.errorMessage = 'No user data';
    }
  }

  // Toggle Dark/Light Mode
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    if (this.currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  goToSettings() {
    this.router.navigate(['/setting']);
  }

  // Logout logic
  logout() {
    console.log('click on logout');
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.errorMessage = 'Logout failed. Please try again.';
      },
    });
  }
}
