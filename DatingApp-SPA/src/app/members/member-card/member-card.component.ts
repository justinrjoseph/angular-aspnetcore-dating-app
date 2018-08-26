import { Component, Input } from '@angular/core';

import { User } from '../../_models/user';

import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  @Input('user') user: User;

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _alertify: AlertifyService
  ) {}

  like(id: number) {
    const userId = this._authService.decodedToken.nameid;

    this._userService.like(userId, id)
      .subscribe(
        () => this._alertify.success(`You like ${this.user.knownAs}.`),
        (error) => this._alertify.error(error)
      )
  }
}
