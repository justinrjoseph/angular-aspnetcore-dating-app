import { Component, OnInit } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../_services/auth.service';

import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private _jwt = new JwtHelperService();

  username = '';
  password = '';
  navUsername;

  constructor(
    private _authService: AuthService,
    private _alertify: AlertifyService,
    private _router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if ( token ) {
      this._authService.decodedToken = this._jwt.decodeToken(token);

      this.navUsername = this._authService.decodedToken.unique_name;
    }
  }

  login() {
    this._authService.login({ username: this.username, password: this.password })
      .subscribe(
        () => this._alertify.success('Logged in successfully.'),
        (error) => this._alertify.error(error),
        () => this._router.navigate(['/members'])
      );
  }

  logout() {
    localStorage.removeItem('token');

    this._alertify.message('logged out');

    this._router.navigate(['/']);
  }

  loggedIn() {
    return this._authService.loggedIn();
  }
}
