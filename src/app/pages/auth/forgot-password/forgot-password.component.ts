import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ])
  });

  onForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    const { email } = this.forgotPasswordForm.value;
    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.toastr.success(response.message, 'Success');
        this.router.navigateByUrl('/reset-password');
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to send password reset email.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }
}
