import { Component, Input } from '@angular/core';

import { User } from '../../_models/user';

@Component({
  selector: 'member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  @Input('user') user: User;
}
