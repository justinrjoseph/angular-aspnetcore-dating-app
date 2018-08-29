import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/paginated-result';

import { HttpClient, HttpParams  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _url = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getAll(id: string, page?, itemsPerPage?, container?): Observable<PaginatedResult<Message[]>> {
    const paginatedResult = new PaginatedResult<Message[]>();

    let params = new HttpParams();

    params = params.append('Container', container);

    if ( page && itemsPerPage ) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this._http.get<Message[]>(`${this._url}/users/${id}/messages`, {
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

  getThread(id: string, recipientId: number): Observable<Message[]> {
    return this._http
      .get<Message[]>(`${this._url}/users/${id}/messages/thread/${recipientId}`);
  }

  send(id: string, msg: Message) {
    return this._http.post(`${this._url}/users/${id}/messages`, msg);
  }

  delete(id: number, userId: string) {
    return this._http.post(`${this._url}/users/${userId}/messages/${id}`, {});
  }

  markAsRead(userId: string, id: number) {
    this._http.post(`${this._url}/users/${userId}/messages/${id}/read`, {})
      .subscribe();
  }
}
