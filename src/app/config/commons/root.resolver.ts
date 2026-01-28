import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RootResolver implements Resolve<boolean> {

  constructor(//private readonly authService: AuthService,
              private readonly router: Router) {}

  resolve(): boolean {
    //if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    //} else {
      //this.router.navigate(['/content']);
    //}
    return true;
  }
};
