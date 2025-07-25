import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  useForm: FormGroup = new FormGroup({
    "username": new FormControl('', [Validators.required, Validators.minLength(3)]),
    "email": new FormControl('', [
      Validators.required, Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    "password": new FormControl('', [Validators.required, Validators.minLength(6)]),
    "confirmPassword": new FormControl('', [Validators.required])
  }, { validators: this.passwordsMatchValidator() });

  passwordsMatchValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  onRegister(): void {
    if (this.useForm.valid) {
      const { username, email, password, confirmPassword } = this.useForm.value;

      this.authService.registration(username, email, password, confirmPassword).subscribe({
        next: (response) => {
          this.toastr.success(`${response.message}`, 'Success');
          this.router.navigateByUrl("login");
        },
        error: (error) => {
          console.log('Full error object:', error); // For debugging

          // Handle different error response formats
          if (error?.error?.errors) {
            // If errors is an array (Mongoose ValidationError)
            if (Array.isArray(error.error.errors)) {
              this.errorMessage = error.error.errors.join(', ');
            }
            // If errors has a message property (custom error format)
            else if (error.error.errors.message) {
              this.errorMessage = error.error.errors.message;
            }
            // If errors is a string
            else if (typeof error.error.errors === 'string') {
              this.errorMessage = error.error.errors;
            }
            else {
              this.errorMessage = 'Registration failed. Please check your input.';
            }
          }
          // Handle direct message from backend
          else if (error?.error?.message) {
            this.errorMessage = error.error.message;
          }
          // Handle HTTP error status messages
          else if (error?.message) {
            this.errorMessage = error.message;
          }
          // Fallback error message
          else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        },
      });
    } else {
      console.log('Form is invalid');
      this.useForm.markAllAsTouched();
    }
  }
}
