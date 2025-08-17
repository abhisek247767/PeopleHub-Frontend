import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentTheme: string = 'light';
  currentYear: number = new Date().getFullYear();
  appVersion: string = '2.0.1';
  showBackToTop: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentTheme = savedTheme;
    
    // Listen for theme changes
    this.watchThemeChanges();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Show back to top button when scrolled down 300px
    this.showBackToTop = window.pageYOffset > 300;
  }

  private watchThemeChanges(): void {
    // Check periodically for theme changes
    setInterval(() => {
      const theme = localStorage.getItem('theme') || 'light';
      if (theme !== this.currentTheme) {
        this.currentTheme = theme;
      }
    }, 1000);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  navigateToPrivacy(): void {
    // You can implement this route or open external link
    console.log('Navigate to Privacy Policy');
    // this.router.navigate(['/privacy']);
  }

  navigateToTerms(): void {
    // You can implement this route or open external link
    console.log('Navigate to Terms & Conditions');
    // this.router.navigate(['/terms']);
  }

  navigateToSupport(): void {
    // You can implement this route or open external link
    console.log('Navigate to Support');
    // this.router.navigate(['/support']);
  }

  navigateToContact(): void {
    // You can implement this route or open external link
    console.log('Navigate to Contact');
    // this.router.navigate(['/contact']);
  }
}