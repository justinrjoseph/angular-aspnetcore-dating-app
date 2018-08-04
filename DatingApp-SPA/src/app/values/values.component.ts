import { Component, OnInit } from '@angular/core';

import { Value } from '../../_models/value';

import { ValueService } from '../../_services/value.service';

@Component({
  selector: 'values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})
export class ValuesComponent implements OnInit {
  values: Value[];

  constructor(private _valueService: ValueService) {}

  ngOnInit(): void {
    this._valueService.getAll()
      .subscribe(
        (values) => this.values = values,
        (error) => console.error(error)
      );
  }
}
