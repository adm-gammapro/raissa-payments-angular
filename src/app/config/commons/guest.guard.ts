import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {

  constructor(//private readonly authService: AuthService,
              private readonly router: Router) {}

  canActivate(): boolean {
    //if (!this.authService.isAuthenticated()) {
      return true;
    //} else {
      //this.router.navigate(['/dashboard']);
      //return false;
    //}
  }
};
