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
        this.business = business;
        this.latControl.patchValue(this.business.location.lat);
        this.lngControl.patchValue(this.business.location.lng);
      });
  }


  setNewCoords(center: any): void {
    this.setFormValues(center.coords);
    this.setBusinessService(center.coords)
  }

  setFormValues(coords: any): void {
    this.latControl.patchValue(coords.lat);
    this.lngControl.patchValue(coords.lng);
  }

  setBusinessService(coords: any) {
    this.business.location.lat = coords.lat;
    this.business.location.lng = coords.lng;
    this.businessService.updateBusiness(this.business);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
