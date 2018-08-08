import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';

import { User } from '../_models/user';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username = '';
  password = '';

  constructor(private _authService: AuthService) {}

  ngOnInit() {
  }

  login() {
    this._authService.login(new User(this.username, this.password))
      .subscribe(
        (next) => console.log('Logged in successfully.'),
        (error) => console.error(error)
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  loggedIn() {
    const token = localStorage.getItem('token');

    return !!token;
  }
}
