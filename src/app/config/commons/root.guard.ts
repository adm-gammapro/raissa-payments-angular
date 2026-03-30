import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Token} from '../../service/authorization/token';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RootGuard implements CanActivate {
  constructor(private readonly token: Token,
              private readonly router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.token.isLogged()) {
      return this.router.parseUrl('/dashboard');
    }
    window.location.href = environment.url.landing;
    return false;
  }
}
