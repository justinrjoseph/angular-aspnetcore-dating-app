import { Injectable } from '@angular/core';

declare const alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() {}

  confirm(msg: string, okCallback: () => any) {
    alertify.confirm(msg, (e) => {
      if ( e ) {
        okCallback();
      }
    });
  }

  message(msg: string) {
    alertify.message(msg);
  }

  success(msg: string) {
    alertify.success(msg);
  }

  warning(msg: string) {
    alertify.warning(msg);
  }

  error(msg: string) {
    alertify.error(msg);
  }
}
