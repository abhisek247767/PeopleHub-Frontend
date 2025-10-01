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
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  currentTheme: string = 'light';
  currentYear: number = new Date().getFullYear();
  appVersion: string = '2.0.1';
  showBackToTop: boolean = false;

  alertVisible: boolean = false;
  alertOptions: any = {};
  private alertSubscription: any;

  constructor(private router: Router, public alertService: AlertService) {}

  ngOnInit(): void {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentTheme = savedTheme;

    // Listen for theme changes
    this.watchThemeChanges();

    // Subscribe to alert service
    this.alertSubscription = this.alertService.alert$.subscribe((alert) => {
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
      behavior: 'smooth',
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
    this.alertService.showInfo('Email: abhisekroy169@gmail.com', 'Contact Us');
  }

  navigateToPrivacy(): void {
    this.alertService.showInfo(
      'Privacy Policy page coming soon! This will show our privacy policy and data handling practices.',
      'Privacy Policy'
    );
  }

  navigateToTerms(): void {
    this.alertService.showInfo(
      'Terms & Conditions page coming soon! This will show our terms of service and user agreement.',
      'Terms & Conditions'
    );
  }

  navigateToSupport(): void {
    this.alertService.showInfo(
      'Support Information:\n\nEmail: support@peoplehub.com\nDocumentation: Coming soon!\n\nSupport page coming soon!',
      'Support'
    );
  }
}
