import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordVisible: boolean = false;
  errorMessage: string = '';
  needsVerification: boolean = false;
  role: ((arg0: string, role: any) => unknown) | undefined;
  successMessage: string | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
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
<<<<<<< HEAD
        this.toastr.success('Login successful!', 'Success');

        if(response.user){
          sessionStorage.setItem('user', JSON.stringify(response.user));
        }

        if(response.token){

          sessionStorage.setItem('authToken', JSON.stringify(response.token));
        }

        // Backend is sending user role in response
        const userRole = response.user?.role || 'user';
        this.router.navigateByUrl('/dashboard');
=======
        // Store user and role in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('role', String(response.user.role));

        // Update component variable
        this.role = response.user.role;

        this.successMessage = `${response.user.role} Login successful! `;
        this.toastr.success(this.successMessage, 'Success');

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard');
        }, 1200);
>>>>>>> 7c1d7ed1a535e8f43bfe96ec95a1f870038eb06e
      },
      error: (error) => {
        if (error.status === 401 && error.error?.needsVerification) {
          this.errorMessage =
            'Your account is not verified. Please verify your email.';
          this.needsVerification = true;
          this.toastr.warning(this.errorMessage, 'Verification Required');
          sessionStorage.setItem('unverifiedEmail', email);
          this.router.navigateByUrl('/verify-email');
        } else {
          this.errorMessage =
            error.error?.errors?.message || 'Login failed. Please try again.';
          this.toastr.error(this.errorMessage, 'Error');
        }
      },
    });
  }
}
