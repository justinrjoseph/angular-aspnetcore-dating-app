import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registering = false;

  constructor() {}

  ngOnInit() {
  }

  enableRegistration() {
    this.registering = true;
  }

  cancelRegistration() {
    this.registering = false;
  }
}
