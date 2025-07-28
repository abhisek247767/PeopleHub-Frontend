import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  profilePictureFile: File | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  useForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordsMatchValidator() });

  passwordsMatchValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
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

  onProfilePictureChange(event: any): void {
    const file = event.target.files[0];
    this.profilePictureFile = file ? file : null;
  }

  onRegister(): void {
    if (this.useForm.valid) {
      const { username, email, password, confirmPassword } = this.useForm.value;
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      if (this.profilePictureFile) {
        formData.append('profilePicture', this.profilePictureFile);
      }
      this.authService.registration(formData).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.toastr.success(response.message, 'Success');
          this.router.navigateByUrl('/verify-email');
        },
        error: (error) => {
          console.log('Full error object:', error);
          if (error.status === 409 && error.error?.needsVerification) {
            this.errorMessage = 'User already exists but is not verified. Please verify your email.';
            this.toastr.warning(this.errorMessage, 'Verification Required');
            // Store email in sessionStorage to prefill verification form
            sessionStorage.setItem('unverifiedEmail', email);
            this.router.navigateByUrl('/verify-email');
          } else {
            this.errorMessage = error.error?.message ||
                              (error.error?.errors ? error.error.errors.join(', ') :
                              'Registration failed. Please check your input.');
            this.toastr.error(this.errorMessage, 'Error');
          }
        }
      });
    } else {
      this.useForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.toastr.error(this.errorMessage, 'Error');
    }
  }
}
