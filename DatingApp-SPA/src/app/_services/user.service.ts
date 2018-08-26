import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaginatedResult } from '../_models/paginated-result';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _url = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getAll(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if ( page && itemsPerPage ) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if ( userParams ) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if ( likesParam === 'Likers' ) {
      params = params.append('likers', 'true');
    }

    if ( likesParam === 'Likees' ) {
      params = params.append('likees', 'true');
    }

    return this._http.get<User[]>(`${this._url}/users`, {
      observe: 'response', params
    })
    .pipe(
      map((response) => {
        paginatedResult.records = response.body;

        const paginationHeader = response.headers.get('Pagination');

        if ( paginationHeader ) {
          paginatedResult.pagination = JSON.parse(paginationHeader);
        }

        return paginatedResult;
      })
    );
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

  like(id: string, recipientId: number) {
    return this._http.post(`${this._url}/users/${id}/like/${recipientId}`, {});
  }
}
