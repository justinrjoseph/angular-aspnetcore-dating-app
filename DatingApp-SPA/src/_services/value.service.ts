import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Value } from '../_models/value';

@Injectable({
  providedIn: 'root'
})
export class ValueService {
  constructor(private _http: HttpClient) { }

  getAll(): Observable<Value[]> {
    return this._http.get<Value[]>('http://localhost:5000/api/values');
  }
}
