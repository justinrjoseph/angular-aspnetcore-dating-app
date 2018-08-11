import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

import { User } from '../_models/user';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output('cancelRegistration') cancelRegistration = new EventEmitter();

  username = '';
  password = '';

  constructor(
    private _authService: AuthService,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
  }

  register() {
    this._authService.register(new User(this.username, this.password))
      .subscribe(
        () => this._alertify.success('registration successful'),
        (error) => this._alertify.error(error)
      );
  }

  cancel() {
    this.cancelRegistration.emit();
  }
}
