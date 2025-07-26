import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  verifyForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    verificationCode: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    // Prefill email from sessionStorage if available
    const unverifiedEmail = sessionStorage.getItem('unverifiedEmail');
    if (unverifiedEmail) {
      this.verifyForm.patchValue({ email: unverifiedEmail });
    }
  }

  onVerify() {
    if (this.verifyForm.invalid) {
      this.errorMessage = 'Please enter valid email and verification code.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    const { email, verificationCode } = this.verifyForm.value;
    this.authService.verifyEmail(email, verificationCode).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.toastr.success(response.message, 'Success');
        // Clear stored email after successful verification
        sessionStorage.removeItem('unverifiedEmail');
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Verification failed. Please try again.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }

  onResendCode() {
    const email = this.verifyForm.get('email')?.value;
    if (!email) {
      this.errorMessage = 'Please enter your email to resend verification code.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    this.authService.resendVerificationCode(email).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.toastr.success(response.message, 'Success');
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to resend verification code.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }
}
