import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { User } from '../_models/user';

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ValidationErrors
} from '@angular/forms';

import { BsDatepickerConfig } from 'ngx-bootstrap';

import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

import { Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output('cancelRegistration') cancelRegistration = new EventEmitter();

  private _user: User;
  form: FormGroup;
  genders = ['male', 'female'];
  dobConfig: Partial<BsDatepickerConfig> = { containerClass: 'theme-red' };

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _alertify: AlertifyService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      username: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['',
        [ Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8) ]
      ],
      confirmPassword: ['', Validators.required]
    }, { validator: this._passwordsMatch });
  }

  register() {
    this._user = this.form.value;

    if ( this.form.valid ) {
      this._authService.register(this._user)
        .subscribe(
          () => {
            this._alertify.success('registration successful');

            this._authService.login(this._user)
              .subscribe(() => this._router.navigate(['/members']));
          },
          (error) => this._alertify.error(error)
        );
    }
  }

  cancel() {
    this.cancelRegistration.emit();
  }

  // Username
  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get usernameErrors(): ValidationErrors {
    return this.username.touched && this.username.errors;
  }

  // KnownAs
  get knownAs(): FormControl {
    return this.form.get('knownAs') as FormControl;
  }

  get knownAsErrors(): ValidationErrors {
    return this.knownAs.touched && this.knownAs.errors;
  }

  get knownAsRequired(): ValidationErrors {
    return this.knownAsErrors && this.knownAs.errors.required;
  }

  // Date of Birth
  get dateOfBirth(): FormControl {
    return this.form.get('dateOfBirth') as FormControl;
  }

  get dateOfBirthErrors(): ValidationErrors {
    return this.dateOfBirth.touched && this.dateOfBirth.errors;
  }

  get dateOfBirthRequired(): ValidationErrors {
    return this.dateOfBirthErrors && this.dateOfBirth.errors.required;
  }

  // City
  get city(): FormControl {
    return this.form.get('city') as FormControl;
  }

  get cityErrors(): ValidationErrors {
    return this.city.touched && this.city.errors;
  }

  get cityRequired(): ValidationErrors {
    return this.cityErrors && this.city.errors.required;
  }

  get country(): FormControl {
    return this.form.get('country') as FormControl;
  }

  // Country
  get countryErrors(): ValidationErrors {
    return this.country.touched && this.country.errors;
  }

  get countryRequired(): ValidationErrors {
    return this.countryErrors && this.country.errors.required;
  }

  // Password
  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get passwordErrors(): ValidationErrors {
    return this.password.touched && this.password.errors;
  }

  get passwordRequired(): ValidationErrors {
    return this.passwordErrors && this.password.errors.required;
  }

  get passwordMinlengthErr(): ValidationErrors {
    return this.passwordErrors && this.password.errors.minlength;
  }

  get passwordMinlengthReq(): ValidationErrors {
    return this.passwordErrors && this.password.errors.minlength.requiredLength;
  }

  get passwordMaxlengthErr(): ValidationErrors {
    return this.passwordErrors && this.password.errors.maxlength;
  }

  get passwordMaxlengthReq(): ValidationErrors {
    return this.passwordErrors && this.password.errors.maxlength.requiredLength;
  }

  // Confirm Password
  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  get confirmPasswordErrors(): ValidationErrors {
    return this.confirmPassword.touched && this.confirmPassword.errors;
  }

  get confirmPasswordRequired(): ValidationErrors {
    return this.confirmPasswordErrors && this.confirmPassword.errors.required;
  }

  // Password and Confirm Password
  get passwordsMismatched(): ValidationErrors {
    return this.confirmPassword.touched && this.form.errors;
  }

  private _passwordsMatch(f: FormGroup): ValidationErrors | null {
    return f.get('password').value === f.get('confirmPassword').value
      ? null
      : { mismatchedPasswords: true };
  }
}
