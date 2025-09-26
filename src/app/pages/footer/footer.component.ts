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
  navigateToHome(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToAbout(): void {
    // For now, scroll to top and show a message
    // In a real app, you would navigate to /about page
    this.scrollToTop();
    alert('About page coming soon! This will show information about PeopleHub.');
  }

  navigateToContact(): void {
    // For now, scroll to top and show contact info
    // In a real app, you would navigate to /contact page
    this.scrollToTop();
    alert('Contact Information:\n\nEmail: support@peoplehub.com\nPhone: +1 (555) 123-4567\n\nContact page coming soon!');
  }
  navigateToPrivacy(): void {
    // For now, scroll to top and show a message
    // In a real app, you would navigate to /privacy page
    this.scrollToTop();
    alert('Privacy Policy page coming soon! This will show our privacy policy and data handling practices.');
  }

  navigateToTerms(): void {
    // For now, scroll to top and show a message
    // In a real app, you would navigate to /terms page
    this.scrollToTop();
    alert('Terms & Conditions page coming soon! This will show our terms of service and user agreement.');
  }

  navigateToSupport(): void {
   // For now, scroll to top and show support info
    // In a real app, you would navigate to /support page
    this.scrollToTop();
    alert('Support Information:\n\nEmail: support@peoplehub.com\nDocumentation: Coming soon!\n\nSupport page coming soon!');
  }
}