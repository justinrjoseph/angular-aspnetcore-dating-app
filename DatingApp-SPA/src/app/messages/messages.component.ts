import { Component, OnInit } from '@angular/core';

import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { PaginatedResult } from '../_models/paginated-result';

import { AuthService } from '../_services/auth.service';
import { MessageService } from '../_services/message.service';
import { AlertifyService } from '../_services/alertify.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  container = 'Unread';

  constructor(
    private _authService: AuthService,
    private _messageService: MessageService,
    private _route: ActivatedRoute,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
    this._route.data
      .subscribe((data) => {
        this.messages = data['messages'].records;
        this.pagination = data['messages'].pagination;
      });
  }

  changePage(event): void {
    this.pagination.currentPage = event.page;

    this.loadAll();
  }

  loadAll(): void {
    const userId = this._authService.decodedToken.nameid;

    const { currentPage, itemsPerPage } = this.pagination;

    this._messageService
      .getAll(userId, currentPage, itemsPerPage, this.container)
      .subscribe(
        (response: PaginatedResult<Message[]>) => {
          this.messages = response.records;
          this.pagination = response.pagination;
        },
        (error) => this._alertify.error(error)
      );
  }

  delete(event: Event, id: number): void {
    event.stopPropagation();

    this._alertify.confirm('Are you sure you want to delete this message?', () => {
      const userId = this._authService.decodedToken.nameid;

      this._messageService.delete(id, userId)
        .subscribe(
          () => {
            this.messages = this.messages.filter((message) => message.id !== id);
            this._alertify.success('Message deleted.');
          },
          () => this._alertify.error('There was a problem deleting the message')
        );
    });
  }
}
