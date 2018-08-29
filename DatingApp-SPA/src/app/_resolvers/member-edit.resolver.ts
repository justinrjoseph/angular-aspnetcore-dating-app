import { Injectable } from '@angular/core';

import { Resolve, Router } from '@angular/router';

import { User } from '../_models/user';

import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberEditResolver implements Resolve<User> {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _router: Router,
    private _alertify: AlertifyService
  ) {}

  resolve(): Observable<User> {
    const id = +this._authService.decodedToken.nameid;

    return this._userService.get(id)
      .pipe(
        catchError(() => {
          this._alertify.error('There was a problem retrieving your data.');
          this._router.navigate(['/members']);

          return of(null);
        })
      );
  }
}
