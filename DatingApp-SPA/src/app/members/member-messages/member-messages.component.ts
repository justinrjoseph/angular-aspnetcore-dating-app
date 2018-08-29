import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';

import { Message } from '../../_models/message';

import { AuthService } from '../../_services/auth.service';
import { MessageService } from '../../_services/message.service';
import { AlertifyService } from './../../_services/alertify.service';

import { tap } from 'rxjs/operators';

@Component({
  selector: 'member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input('recipient') recipientId: number;

  @ViewChild('f') form: NgForm;

  messages: Message[];
  message: any = {};

  constructor(
    private _authService: AuthService,
    private _messageService: MessageService,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
    const userId = this._authService.decodedToken.nameid;

    this._messageService.getThread(userId, this.recipientId)
      .pipe(
        tap((messages) => {
          messages.forEach((message) => {
            if ( !message.isRead && message.recipientId === +userId ) {
              this._messageService.markAsRead(userId, message.id);
            }
          });
        })
      )
      .subscribe(
        (messages) => this.messages = messages,
        (error) => this._alertify.error(error)
      );
  }

  sendMessage() {
    if ( this.form.valid ) {
      this.message.recipientId = this.recipientId;

      const userId = this._authService.decodedToken.nameid;

      this._messageService.send(userId, this.message)
        .subscribe(
          (message: Message) => {
            this.messages = [message, ...this.messages];
            this.message.content = '';
          },
          (error) => this._alertify.error(error)
        );
    }
  }
}
