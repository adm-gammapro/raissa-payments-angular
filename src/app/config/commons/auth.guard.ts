import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(//private readonly authService: AuthService,
              private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot
  ): boolean {
    //if (this.authService.isAuthenticated()) {
      return true;
    //} else {
      //this.router.navigate(['/content'], {
        //queryParams: { returnUrl: state.url }
      //});
      //return false;
    //}
  }
};
