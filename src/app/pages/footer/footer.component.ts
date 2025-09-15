import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/custom-alert/alert.service';
import { CustomAlertComponent } from '../../shared/custom-alert/custom-alert.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, CustomAlertComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  currentTheme: string = 'light';
  currentYear: number = new Date().getFullYear();
  appVersion: string = '2.0.1';
  showBackToTop: boolean = false;
  
  // Alert properties
  alertVisible: boolean = false;
  alertOptions: any = {};
  private alertSubscription: any;

  constructor(
    private router: Router,
    public alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentTheme = savedTheme;
    
    // Listen for theme changes
    this.watchThemeChanges();
    
    // Subscribe to alert service
    this.alertSubscription = this.alertService.alert$.subscribe(alert => {
      this.alertVisible = alert.isVisible;
      this.alertOptions = alert.options;
    });
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
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
    this.scrollToTop();
    this.router.navigate(['/dashboard']);
  }

  navigateToAbout(): void {
    // For now, scroll to top and show a message
    // In a real app, you would navigate to /about page
    this.alertService.showInfo(
      'About page coming soon! This will show information about PeopleHub.',
      'About Us'
    );
  }

  navigateToContact(): void {
    // For now, scroll to top and show contact info
    // In a real app, you would navigate to /contact page
    this.alertService.showInfo(
      'Email: support@peoplehub.com',
      'Contact Us'
    );
  }

  navigateToPrivacy(): void {
    // For now, scroll to top and show a message
    // In a real app, you would navigate to /privacy page
    this.alertService.showInfo(
      'Privacy Policy page coming soon! This will show our privacy policy and data handling practices.',
      'Privacy Policy'
    );
  }

  navigateToTerms(): void {
    // For now, scroll to top and show a message
    // In a real app, you would navigate to /terms page
    this.alertService.showInfo(
      'Terms & Conditions page coming soon! This will show our terms of service and user agreement.',
      'Terms & Conditions'
    );
  }

  navigateToSupport(): void {
    // For now, scroll to top and show support info
    // In a real app, you would navigate to /support page
    this.alertService.showInfo(
      'Support Information:\n\nEmail: support@peoplehub.com\nDocumentation: Coming soon!\n\nSupport page coming soon!',
      'Support'
    );
  }
}