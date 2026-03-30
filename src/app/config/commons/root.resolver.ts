import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import {Token} from '../../service/authorization/token';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RootResolver implements Resolve<boolean> {

  constructor(private readonly tokenService: Token,
              private readonly router: Router) {}

  resolve(): boolean {
    if (this.tokenService.isLogged()) {
      this.router.navigate(['/dashboard']);
    } else {
      window.location.href = environment.url.landing;
    }
    return true;
  }
}
