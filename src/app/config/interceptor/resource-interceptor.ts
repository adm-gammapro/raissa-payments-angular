import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {Token} from '../../service/authorization/token';
import {environment} from '../../../environments/environment';

export const resourceInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);

  if (req.url.startsWith(environment.url.base)) {
    const token = tokenService.getAccessToken();
    const isFormData = req.body instanceof FormData;

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    req = req.clone({
      setHeaders: headers
    });
  }

  return next(req);
};
