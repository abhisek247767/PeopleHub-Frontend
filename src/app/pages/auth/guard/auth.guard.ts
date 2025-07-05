import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from '../service/auth.service'

export const authGuard: CanActivateFn = (route, state) => {
  // Check if the user is logged in or not
  //debugger;
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/login'])
    return false;  
  }

};
