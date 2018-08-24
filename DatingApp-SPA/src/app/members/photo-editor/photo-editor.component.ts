import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Photo } from '../../_models/photo';

import { environment } from '../../../environments/environment';

import { FileUploader } from 'ng2-file-upload';

import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input('photos') photos: Photo[];
  currentMain: Photo;

  @Output('mainPhotoChanged') mainPhotoChanged = new EventEmitter<string>();

  private _url = environment.apiUrl;

  uploader: FileUploader;
  hasDropZoneOver = false;

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this._initializeUploader();
  }

  fileOverBase(e): void {
    this.hasDropZoneOver = e;
  }

  private _initializeUploader(): void {
    this.uploader = new FileUploader({
      url: `${this._url}/users/${this._authService.decodedToken.nameid}/photos`,
      authToken: `Bearer ${localStorage.getItem('token')}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 // 10mb
    });

    this.uploader.onAfterAddingFile = (file) => file.withCredentials = false;

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if ( response ) {
        const res: Photo = JSON.parse(response);
        const photo = { ...res };

        this.photos = [...this.photos, photo];

        if ( photo.isMain ) this._updateMainPhoto(photo);
      }
    };
  }

  setMainPhoto(photo: Photo): void {
    const userId = this._authService.decodedToken.nameid;

    this._userService.setMainPhoto(userId, photo.id)
      .subscribe(
        () => {
          this.currentMain = this.photos.find((p) => p.isMain);
          this.currentMain.isMain = false;
          photo.isMain = true;

          this._updateMainPhoto(photo);

          this._alertify.success('You have a new main photo.');
        },
        (error) => this._alertify.error(error)
      );
  }

  deletePhoto(id: number): void {
    this._alertify.confirm('Are you sure you want to delete this photo?', () => {
      const userId = this._authService.decodedToken.nameid;

      this._userService.deletePhoto(userId, id)
        .subscribe(
          () => this.photos = this.photos.filter((photo) => photo.id !== id),
          () => this._alertify.error('There was a problem deleting the photo.')
        );
    });
  }

  private _updateMainPhoto(photo): void {
    this._authService.changeNavPhoto(photo.url);
    this._authService.currentUser.photoUrl = photo.url;

    localStorage.setItem('user', JSON.stringify(this._authService.currentUser));
  }
}
