import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Jwt } from '../_models/jwt';
import { User } from '../_models/user';

import { Observable, BehaviorSubject } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _url = `${environment.apiUrl}/auth`;
  private _jwt = new JwtHelperService();

  decodedToken: Jwt;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  newNavPhoto = this.photoUrl.asObservable();

  constructor(private _http: HttpClient) {}

  register(user) {
    return this._http.post(`${this._url}/register`, user);
  }

  login(user): Observable<void> {
    return this._http.post(`${this._url}/login`, user)
      .pipe(
        map((response: any) => {
          if ( response ) {
            const { token, user: appUser } = response;

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(appUser));

            this.decodedToken = this._jwt.decodeToken(token);
            this.currentUser = appUser;

            this.changeNavPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  loggedIn() {
    const token = localStorage.getItem('token');

    return !this._jwt.isTokenExpired(token);
  }

  changeNavPhoto(url: string) {
    this.photoUrl.next(url);
  }
}
