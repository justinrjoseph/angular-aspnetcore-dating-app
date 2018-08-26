import { Component, OnInit } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../_services/auth.service';

import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

import { User } from '../_models/user';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private _jwt = new JwtHelperService();

  username = '';
  password = '';

  navThumbnail: string;
  navUsername: string;

  constructor(
    private _authService: AuthService,
    private _alertify: AlertifyService,
    private _router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));

    if ( token ) {
      this._authService.newNavUsername
        .subscribe((username) => this.navUsername = username);

      this._authService.decodedToken = this._jwt.decodeToken(token);

      this.navUsername = this._authService.decodedToken.unique_name;
    }

    if ( user ) {
      this._authService.currentUser = user;
      this._authService.changeNavPhoto(user.photoUrl);

      this.navThumbnail = user.photoUrl;
    }

    this._authService.newNavPhoto.subscribe((url) => this.navThumbnail = url);
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
    this.username = '';
    this.password = '';

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this._authService.decodedToken = null;
    this._authService.currentUser = null;

    this._alertify.message('logged out');

    this._router.navigate(['/']);
  }

  loggedIn() {
    return this._authService.loggedIn();
  }
}
