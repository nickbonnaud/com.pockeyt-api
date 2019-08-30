import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-photo-form',
  templateUrl: './photo-form.component.html',
  styleUrls: ['./photo-form.component.scss']
})
export class PhotoFormComponent implements OnInit, OnDestroy {
  @Input() parentFormGroup: FormGroup;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  bannerControl: AbstractControl;
  logoControl: AbstractControl;

  bannerActive: boolean = false;
  logoPreviewUrl: string | ArrayBuffer = null;
  bannerPreviewUrl: string | ArrayBuffer = null;

  constructor() { }

  ngOnInit(): void {
    this.bannerControl = this.parentFormGroup.get('banner');
    this.logoControl = this.parentFormGroup.get('logo');

    this.watchLogo();
    this.watchBanner();
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

  next() {
    this.bannerActive = true;
  }

  prev() {
    this.bannerActive = false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

}
