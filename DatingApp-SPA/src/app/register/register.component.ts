import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthService } from '../_services/auth.service';
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

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  register() {
    this._authService.register(new User(this.username, this.password))
      .subscribe(
        () => console.log('registration successful'),
        (error) => console.error(error)
      );
  }

  cancel() {
    this.cancelRegistration.emit();
  }
}
