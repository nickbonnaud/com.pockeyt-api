import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/models/business/business';

@Component({
  selector: 'photo-form',
  templateUrl: './photo-form.component.html',
  styleUrls: ['./photo-form.component.scss']
})
export class PhotoFormComponent implements OnInit, OnDestroy {
  @Input() parentFormGroup: FormGroup;
  @Input() editMode: boolean;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  bannerControl: AbstractControl;
  logoControl: AbstractControl;

  bannerActive: boolean = false;
  logoPreviewUrl: string | ArrayBuffer = null;
  bannerPreviewUrl: string | ArrayBuffer = null;

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.bannerControl = this.parentFormGroup.get('banner');
    this.logoControl = this.parentFormGroup.get('logo');

    this.fetchPhotos();
    this.watchLogo();
    this.watchBanner();
  }

  fetchPhotos(): void {
    this.businessService.business$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((business: Business) => {
        let photos = business.photos;
        if (photos) {
          photos.banner.largeUrl != undefined ? this.bannerPreviewUrl = photos.banner.largeUrl : null;
        photos.logo.largeUrl != undefined ? this.logoPreviewUrl = photos.logo.largeUrl : null;
        }
      });
  }

  onImageInput(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (this.bannerActive) {
          this.bannerPreviewUrl = reader.result;
          this.addBanner(file);
        } else {
          this.logoPreviewUrl = reader.result;
          this.addLogo(file);
        }
      }
    }
  }

  addLogo(file: File): void {
    this.logoControl.patchValue(file);
  }

  addBanner(file: File): void {
    this.bannerControl.patchValue(file);
  }

  watchLogo(): void {
    this.logoControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (!this.logoControl.touched) {
        this.logoControl.markAsTouched();
      }
    });
  }

  watchBanner(): void {
    this.bannerControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (!this.bannerControl.touched) {
        this.bannerControl.markAsTouched();
      }
    });
  }

  next(fileInput: any) {
    this.bannerActive = true;
    this.bannerControl.untouched ? fileInput.click() : null;
  }

  prev() {
    this.bannerActive = false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

}
