import { Injectable } from '@angular/core';

import { Resolve, Router } from '@angular/router';

import { Message } from '../_models/message';

import { AuthService } from '../_services/auth.service';
import { MessageService } from '../_services/message.service';
import { AlertifyService } from '../_services/alertify.service';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  container = 'Unread';

  constructor(
    private _authService: AuthService,
    private _messageService: MessageService,
    private _router: Router,
    private _alertify: AlertifyService
  ) {}

  resolve(): Observable<Message[]> {
    const userId = this._authService.decodedToken.nameid;

    return this._messageService
      .getAll(userId, this.pageNumber, this.pageSize, this.container)
      .pipe(
        catchError((error) => {
          this._alertify.error(error);
          this._router.navigate(['/']);

          return of(null);
        })
      );
  }
}
