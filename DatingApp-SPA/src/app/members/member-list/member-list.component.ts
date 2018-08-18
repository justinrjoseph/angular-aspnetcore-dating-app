import { Component, OnInit } from '@angular/core';

import { User } from '../../_models/user';

import { ActivatedRoute } from '@angular/router';

import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(
    private _route: ActivatedRoute,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
    this._route.data
      .subscribe(
        (data) => this.users = data['users'],
        (error) => this._alertify.error(error)
      );
  }
}
