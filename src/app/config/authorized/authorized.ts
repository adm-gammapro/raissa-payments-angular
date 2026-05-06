import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Auth} from '../../service/authorization/auth';
import {Token} from '../../service/authorization/token';
import {switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-authorized',
  imports: [
    Toast
  ],
  providers: [MessageService],
  templateUrl: './authorized.html',
  styleUrl: './authorized.scss',
})
export class Authorized implements OnInit {
  code_verifier = '';
  code = '';

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly messageService: MessageService,
              private readonly authService: Auth,
              private readonly tokenService: Token,
              private readonly router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe( data => {
      const error = data['error'];
      const errorDesc = data['error_description'];
      const code = data['code'];
      const codeVerifier = this.tokenService.getVerifier();

      if (error) {
        const msg = decodeURIComponent(errorDesc || error);
        this.tokenService.clear();
        const target = environment.url.landing;
        window.location.replace(`${target}?authError=${encodeURIComponent(msg)}`);
        return;
      }

      if (!code) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se recibió el código de autorización.' });
        return;
      }

      this.getToken(codeVerifier, code);
    });
  }

  getToken(code_verifier: string, code: string): void {
    this.authService.getToken(code, code_verifier).pipe(
      tap(value => {
        console.log(value);
        this.tokenService.setTokens(value.access_token, value.refresh_token, value.expires_in);
      }),
      switchMap(value => this.authService.guardarUsuario(value.access_token))
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.tokenService.clear();
        const msg = err?.message
          || err?.error?.error_description
          || err?.error?.error
          || 'Error al obtener token.';

        const target = environment.url.landing;
        window.location.replace(`${target}?authError=${encodeURIComponent(msg)}`);
      }
    });
  }
}
