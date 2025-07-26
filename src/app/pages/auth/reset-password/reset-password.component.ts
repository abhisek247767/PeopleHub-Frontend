import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  errorMessage: string = '';
  successMessage: string = '';
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  resetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    resetCode: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordsMatchValidator() });

  passwordsMatchValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('newPassword')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      return password === confirmPassword ? null : { passwordsMismatch: true };
    };
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  onResetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    const { email, resetCode, newPassword, confirmPassword } = this.resetPasswordForm.value;
    this.authService.resetPassword(email, resetCode, newPassword, confirmPassword).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.toastr.success(response.message, 'Success');
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to reset password.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }
}
