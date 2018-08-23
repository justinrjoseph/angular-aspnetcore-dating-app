import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _url = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this._http.get<User[]>(`${this._url}/users`);
  }

  get(id: number): Observable<User> {
    return this._http.get<User>(`${this._url}/users/${id}`);
  }

  update(id: string, user: User) {
    return this._http.put(`${this._url}/users/${id}`, user);
  }

  setMainPhoto(userId: string, id: number) {
    return this._http.post(`${this._url}/users/${userId}/photos/${id}/setMain`, null);
  }

  deletePhoto(userId: string, id: number) {
    return this._http.delete(`${this._url}/users/${userId}/photos/${id}`);
  }
}
