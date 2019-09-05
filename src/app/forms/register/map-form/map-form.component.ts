import { BusinessService } from './../../../services/business.service';
import { Subject } from 'rxjs/internal/Subject';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Business } from 'src/app/models/business/business';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-map-form',
  templateUrl: './map-form.component.html',
  styleUrls: ['./map-form.component.scss']
})
export class MapFormComponent implements OnInit, OnDestroy {
  @Input() parentFormGroup: FormGroup;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  radiusControl: AbstractControl;
  latControl: AbstractControl;
  lngControl: AbstractControl;

  business: Business;

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.radiusControl = this.parentFormGroup.get('radius');
    this.latControl = this.parentFormGroup.get('lat');
    this.lngControl = this.parentFormGroup.get('lng');

    this.watchBusiness();
  }

  watchBusiness(): void {
    this.businessService.business$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((business: Business) => {
        if (this.business != null) {
          if (this.business.location.coords.lat != business.location.coords.lat) {
            console.log('lat');
            this.latControl.patchValue(business.location.coords.lat);
          }

          if (this.business.location.coords.lng != business.location.coords.lng) {
            console.log('lng');
            this.lngControl.patchValue(business.location.coords.lng);
          }
          this.business = business;
        } else if (this.business == null && (business.location.coords.lat != null && business.location.coords.lng != null)) {
          console.log('initial')
          this.latControl.patchValue(business.location.coords.lat);
          this.lngControl.patchValue(business.location.coords.lng);
          this.business = business;
        }
      });
  }


  setNewCoords(center): void {
    console.log('set new cords');
    this.business.location.coords.lat = center.coords.lat;
    this.latControl.patchValue(center.coords.lat);

    this.business.location.coords.lng = center.coords.lng;
    this.lngControl.patchValue(center.coords.lng);

    this.businessService.updateBusiness(this.business);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
