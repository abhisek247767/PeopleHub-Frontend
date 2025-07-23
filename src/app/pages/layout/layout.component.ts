import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private userDetails: any;
  userName: string | null = null;
  //router = inject(Router);
  errorMessage: string = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const storedUserData = sessionStorage.getItem('user');

    if (storedUserData) {
      this.userDetails = JSON.parse(storedUserData);
      // console.log(this.userDetails.username);
      this.userName = this.userDetails ? this.userDetails.username : null;
    } else {
      this.errorMessage = 'No user data';
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
