import {
  ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import Aura from '@primeuix/themes/aura';
import {providePrimeNG} from 'primeng/config';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {resourceInterceptor} from './config/interceptor/resource-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideHttpClient(withInterceptors([resourceInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ]
};
