import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check if user has admin or superadmin role
  if (authService.isAdmin()) {
    return true;
  } else {
    // Redirect non-admin users to regular dashboard
    router.navigate(['/dashboard']);
    return false;
  }
};
