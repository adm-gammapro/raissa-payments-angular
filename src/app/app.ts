import {Component, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('RAISSA PAYMENTS');

  constructor(//private readonly authService: AuthService,
              private readonly router: Router) {}

  ngOnInit() {
    //this.authService.isAuthenticated$.subscribe(isAuth => {
      //if (isAuth && this.router.url === '/content') {
        this.router.navigate(['/dashboard']);
      //} else if (!isAuth && this.router.url !== '/content') {
        //this.router.navigate(['/content']);
      //}
    //});
  }
}
