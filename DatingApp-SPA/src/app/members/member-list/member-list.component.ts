import { Component, OnInit } from '@angular/core';

import { User } from '../../_models/user';
import { UserParams } from '../../_models/user-params';
import { Pagination } from '../../_models/pagination';
import { PaginatedResult } from '../../_models/paginated-result';

import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  user: User = JSON.parse(localStorage.getItem('user'));
  users: User[];
  userParams: UserParams = {};
  genders = ['male', 'female'];
  pagination: Pagination;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
    this._route.data
      .subscribe(
        (data) => {
          this.users = data['users'].records;
          this.pagination = data['users'].pagination;
        },
        (error) => this._alertify.error(error)
      );

    this._resetUserParams();
  }

  changePage(event): void {
    this.pagination.currentPage = event.page;

    this.reloadUsers();
  }

  resetFilters(): void {
    this._resetUserParams();
    this.reloadUsers();
  }

  reloadUsers(): void {
    const { currentPage, itemsPerPage } = this.pagination;

    this._userService.getAll(currentPage, itemsPerPage, this.userParams)
      .subscribe(
        (result: PaginatedResult<User[]>) => {
          this.users = result.records;
          this.pagination = result.pagination;
        },
        (error) => this._alertify.error(error)
      );
  }

  private _resetUserParams(): void {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }
}
