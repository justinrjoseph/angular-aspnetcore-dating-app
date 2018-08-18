import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../_models/user';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

import { ActivatedRoute } from '@angular/router';

import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
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
