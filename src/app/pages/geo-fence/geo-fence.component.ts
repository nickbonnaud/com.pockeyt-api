import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { urls } from 'src/app/urls/main';
import { FormControlProviderService } from 'src/app/forms/services/form-control-provider.service';
import { Location } from 'src/app/models/business/location';
import { BusinessService } from 'src/app/services/business.service';
import { ApiService } from 'src/app/services/api.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: "app-geo-fence",
  templateUrl: "./geo-fence.component.html",
  styleUrls: ["./geo-fence.component.scss"]
})
export class GeoFenceComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  mapForm: FormGroup;
  location: Location;

  formLocked: boolean = true;
  loading: boolean = false;
  BASE_URL: string;

  constructor(
    private fcProvider: FormControlProviderService,
    private businessService: BusinessService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.BASE_URL = urls.business.location;
    let location: Location = this.fetchLocation();
    this.mapForm = this.fcProvider.registerMapControls(location.radius);
    this.setMapForm(location);
    this.mapForm.disable();
  }

  fetchLocation(): Location {
    return this.businessService.business$.value.location;
  }

  setMapForm(location: Location) {
    this.location = location;
    let locationData = Object.assign({}, location);
    delete locationData["identifier"];
    this.mapForm.setValue(locationData);
  }

  submit(): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .patch<Location>(this.BASE_URL, this.mapForm.value, this.location.identifier)
        .pipe(
          tap(_ => {},
            err => this.loading = false
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((location: Location) => {
          this.businessService.updateLocation(location);
          this.setMapForm(location);
          this.toggleLock();
          this.loading = false;
        })
    }
  }

  toggleLock(): void {
    this.formLocked = !this.formLocked;
    this.mapForm.disabled ? this.mapForm.enable() : this.mapForm.disable();
    if (this.formLocked) {
      this.setMapForm(this.location);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
