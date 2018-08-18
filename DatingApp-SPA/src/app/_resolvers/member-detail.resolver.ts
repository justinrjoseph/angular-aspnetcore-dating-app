import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { User } from '../_models/user';

import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const id = +route.params['id'];

    return this._userService.get(id)
      .pipe(
        catchError((error) => {
          this._alertify.error(error);
          this._router.navigate(['/members']);

          return of(null);
        })
      );
  }
}
