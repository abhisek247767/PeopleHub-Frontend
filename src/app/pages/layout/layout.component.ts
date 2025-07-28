import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private userDetails: any;
  userName: string | null = null;
  //router = inject(Router);
  errorMessage: string = '';
  isDarkMode: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // User info logic
    const storedUserData = sessionStorage.getItem('user');
    if (storedUserData) {
      this.userDetails = JSON.parse(storedUserData);
      this.userName = this.userDetails ? this.userDetails.username : null;
    } else {
      this.errorMessage = 'No user data';
    }
    // Theme logic
    const theme = localStorage.getItem('theme');
    this.isDarkMode = theme === 'dark';
    console.log('ngOnInit: theme from localStorage =', theme, ', isDarkMode =', this.isDarkMode);
    this.applyTheme();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    console.log('toggleDarkMode: isDarkMode =', this.isDarkMode);
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  goToSettings() {
    this.router.navigate(['/setting']);
  }

  logout() {
    console.log('click on logut');
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
