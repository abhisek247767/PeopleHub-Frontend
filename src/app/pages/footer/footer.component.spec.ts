import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: Router, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('light');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('should scroll to top when scrollToTop is called', () => {
    // Create a spy with explicit typing to avoid overload confusion
    const scrollToSpy = jasmine.createSpy('scrollTo');
    window.scrollTo = scrollToSpy;
    
    component.scrollToTop();
    
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });

  it('should show back to top button when scrolled', () => {
    // Mock window.pageYOffset
    Object.defineProperty(window, 'pageYOffset', { value: 500, writable: true });
    component.onWindowScroll();
    expect(component.showBackToTop).toBe(true);
  });

  it('should hide back to top button when at top', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
    component.onWindowScroll();
    expect(component.showBackToTop).toBe(false);
  });

  it('should handle theme changes', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('dark');
    component.ngOnInit();
    expect(component.currentTheme).toBe('dark');
  });

  it('should call navigation methods', () => {
    spyOn(console, 'log');
    
    component.navigateToPrivacy();
    expect(console.log).toHaveBeenCalledWith('Navigate to Privacy Policy');
    
    component.navigateToTerms();
    expect(console.log).toHaveBeenCalledWith('Navigate to Terms & Conditions');
    
    component.navigateToSupport();
    expect(console.log).toHaveBeenCalledWith('Navigate to Support');
    
    component.navigateToContact();
    expect(console.log).toHaveBeenCalledWith('Navigate to Contact');
  });
});