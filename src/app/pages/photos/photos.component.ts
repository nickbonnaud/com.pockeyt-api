import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Photos } from 'src/app/models/business/photos';
import { FormControlProviderService } from 'src/app/forms/services/form-control-provider.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { urls } from 'src/app/urls/main';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/models/business/business';
import { Profile } from 'src/app/models/business/profile';
import { FileUploaderService } from 'src/app/services/file-uploader.service';

@Component({
  selector: "photos",
  templateUrl: "./photos.component.html",
  styleUrls: ["./photos.component.scss"]
})
export class PhotosComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  photosForm: FormGroup;
  photos: Photos;
  profile: Profile;

  BASE_URL: string = urls.business.photos_store;
  loading: boolean = false;

  constructor (
    private fcProvider: FormControlProviderService,
    private businessService: BusinessService,
    private fileUploader: FileUploaderService
  ) {}

  ngOnInit() {
    this.getProfile();
    this.photosForm = this.fcProvider.registerPhotosControls();
    this.watchFileChanges();
  }

  watchFileChanges(): void {
    this.photosForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(fileData => {
        this.submitPhoto(fileData);
      })
  }

  getProfile(): void {
    this.businessService.business$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((business: Business) => {
        this.profile = business.profile;
      })
  }

  submitPhoto(fileData: any): void {
    const isLogo: boolean = fileData.banner == undefined;
    if ((isLogo && this.photosForm.get('logo').valid) || (!isLogo && this.photosForm.get('banner').valid)) {
      let photoData = isLogo ? this.photosForm.get('logo').value : this.photosForm.get('banner').value;

      this.postPhoto(photoData, isLogo);
    }
  }

  postPhoto(photo: any, isLogo: boolean): void {
    if (!this.loading) {
      this.loading = true;

      let photoData: FormData = new FormData();
      photoData.append("photo", photo);
      photoData.append("is_logo", isLogo + "");

      this.fileUploader.post<Photos>(
        this.BASE_URL,
        photoData,
        this.profile.identifier
      )
        .pipe(takeUntil(this.destroyed$))
        .subscribe((photos: Photos) => {
          this.businessService.updatePhotos(photos);
          this.loading = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
