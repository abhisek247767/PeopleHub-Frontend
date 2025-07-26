import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  passwordVisible: boolean = false;
  errorMessage: string = '';
  needsVerification: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid email and password.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        this.toastr.success('Login successful!', 'Success');
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        if (error.status === 401 && error.error?.needsVerification) {
          this.errorMessage = 'Your account is not verified. Please verify your email.';
          this.needsVerification = true;
          this.toastr.warning(this.errorMessage, 'Verification Required');
          // Store email in sessionStorage to prefill verification form
          sessionStorage.setItem('unverifiedEmail', email);
          this.router.navigateByUrl('/verify-email');
        } else {
          this.errorMessage = error.error?.errors?.message || 'Login failed. Please try again.';
          this.toastr.error(this.errorMessage, 'Error');
        }
      }
    });
  }
}
