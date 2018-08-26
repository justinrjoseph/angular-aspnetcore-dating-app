import { Component, OnInit } from '@angular/core';

import { User } from '../_models/user';
import { Pagination } from '../_models/pagination';
import { PaginatedResult } from '../_models/paginated-result';

import { AuthService } from './../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam = 'Liker';

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
    this._route.data
      .subscribe(
        (data) => {
          this.users = data['users'].records;
          this.pagination = data['users'].pagination;
        }
      )
  }

  changePage(event): void {
    this.pagination.currentPage = event.page;

    this.reloadUsers();
  }

  reloadUsers(): void {
    const { currentPage, itemsPerPage } = this.pagination;

    this._userService.getAll(currentPage, itemsPerPage, null, this.likesParam)
      .subscribe(
        (result: PaginatedResult<User[]>) => {
          this.users = result.records;
          this.pagination = result.pagination;
        },
        (error) => this._alertify.error(error)
      );
  }
}
