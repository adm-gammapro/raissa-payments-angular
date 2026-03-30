import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Token} from '../../service/authorization/token';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {

  constructor(private readonly tokenService: Token) {}

  canActivate(): boolean {
    if (this.tokenService.isLogged()) {
      return true;
    } else {
      window.location.href = environment.url.landing;
      return false;
    }
  }
}
