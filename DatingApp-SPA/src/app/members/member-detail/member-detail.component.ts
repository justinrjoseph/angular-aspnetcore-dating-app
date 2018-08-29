import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { User } from '../../_models/user';

import { TabsetComponent } from 'ngx-bootstrap';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

import { ActivatedRoute, Params } from '@angular/router';

import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs: TabsetComponent;

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private _route: ActivatedRoute,
    private _alertify: AlertifyService
  ) {}

  ngOnInit() {
    this._route.data.subscribe(
      (data) => this.user = data['user'],
      (error) => this._alertify.error(error)
    );

    this._route.queryParams
      .subscribe((params: Params) => {
        const selectedTab = params.tab;

        this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
      });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];

    this.galleryImages = this._getImages();
  }

  selectTab(tabId: number): void {
    this.memberTabs.tabs[tabId].active = true;
  }

  private _getImages() {
    let imageUrls = [];

    for ( const photo of this.user.photos ) {
      imageUrls = [...imageUrls, {
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      }];
    }

    return imageUrls;
  }
}
