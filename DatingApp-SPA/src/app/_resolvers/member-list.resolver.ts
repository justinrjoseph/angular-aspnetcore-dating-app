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
export class MemberListResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _alertify: AlertifyService
  ) {}

  resolve(): Observable<User[]> {
    return this._userService.getAll(this.pageNumber, this.pageSize)
      .pipe(
        catchError((error) => {
          this._alertify.error(error);
          this._router.navigate(['/']);

          return of(null);
        })
      );
  }
}
