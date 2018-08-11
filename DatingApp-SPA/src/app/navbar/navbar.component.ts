import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';

import { User } from '../_models/user';

import { AlertifyService } from '../_services/alertify.service';

import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private _jwt = new JwtHelperService();

  username = '';
  password = '';

  constructor(
    private _authService: AuthService,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if ( token ) {
      this._authService.decodedToken = this._jwt.decodeToken(token);

      this.username = this._authService.decodedToken.unique_name;
    }
  }

  login() {
    this._authService.login(new User(this.username, this.password))
      .subscribe(
        (next) => {
          this._alertify.success('Logged in successfully.');
        },
        (error) => this._alertify.error(error)
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._alertify.message('logged out');
  }

  loggedIn() {
    return this._authService.loggedIn();
  }
}
