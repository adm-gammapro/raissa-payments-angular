import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Token} from '../../service/authorization/token';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private readonly token: Token,
              private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const logged = this.token.isLogged();
    const url = state.url;
    const publicUrls = ['/login', '/authorized'];

    if (publicUrls.includes(url)) {
      return logged ? this.router.parseUrl('/dashboard') : true;
    }

    if (logged) return true;

    window.location.href = environment.url.landing;
    return false;
  }
}
