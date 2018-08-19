import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import { User } from '../../_models/user';

import { NgForm } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User;
  @ViewChild('f') form: NgForm;

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: Event) {
    if ( this.form.dirty ) {
      $event.returnValue = true;
    }
  }

  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _userService: UserService,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
    this._route.data.subscribe((data) => this.user = data['user']);
  }

  updateUser() {
    const id = this._authService.decodedToken.nameid;

    this._userService.update(id, this.user)
      .subscribe(
        () => {
          this._alertify.success('Profile updated successfully.');
          this.form.reset(this.user);
        },
        (error) => this._alertify.error(error)
      );
  }
}
