import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _alertify: AlertifyService,
    private _router: Router
  ) {}

  canActivate(): boolean {
    if ( this._authService.loggedIn() ) {
      return true;
    }

    this._alertify.error('You shall not pass!!');
    this._router.navigate(['/']);

    return false;
  }
}
