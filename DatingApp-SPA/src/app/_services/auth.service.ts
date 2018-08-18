import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Jwt } from '../_models/jwt';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _url = `${environment.apiUrl}/auth`;
  private _jwt = new JwtHelperService();

  decodedToken: Jwt;

  constructor(private _http: HttpClient) {}

  register(user) {
    return this._http.post(`${this._url}/register`, user);
  }

  login(user): Observable<void> {
    return this._http.post(`${this._url}/login`, user)
      .pipe(
        map((response: any) => {
          const appUser = response;

          if ( appUser ) {
            localStorage.setItem('token', appUser.token);

            this.decodedToken = this._jwt.decodeToken(appUser.token);
          }
        })
      );
  }

  loggedIn() {
    const token = localStorage.getItem('token');

    return !this._jwt.isTokenExpired(token);
  }
}
