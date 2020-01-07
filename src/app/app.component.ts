import { Component, OnDestroy } from '@angular/core';
import { RouteFinderService } from './services/route-finder.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from './services/api.service';
import { urls } from './urls/main';
import { Business } from './models/business/business';
import { BusinessService } from './services/business.service';

interface NavUrls {
  prev: string;
  nextOrCurrent: string;
}

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent {
  hasFetchedBusiness: boolean = false;
  title: string = "dashboard-business";

  constructor (
    private routeFinderService: RouteFinderService,
    private api: ApiService,
    private businessService: BusinessService
  ) {
    this.checkFetchBusinessData();
  }

  checkFetchBusinessData(): void {
    if (!this.hasFetchedBusiness) {
      let destroyed$: Subject<boolean> = new Subject<boolean>();
      this.routeFinderService.urlChanging$
        .pipe(takeUntil(destroyed$))
        .subscribe((changingUrl: NavUrls) => {
          if (changingUrl.prev == "/auth/login" && changingUrl.nextOrCurrent == '/dashboard/home') {
            destroyed$.next(true);
            destroyed$.unsubscribe();
            this.fetchBusiness();
          }
        });
    }
  }

  fetchBusiness(): void {
    let destroyed$: Subject<boolean> = new Subject<boolean>();
    this.api.get(urls.business.me)
      .pipe(takeUntil(destroyed$))
      .subscribe((business: Business) => {
        destroyed$.next(true);
        destroyed$.unsubscribe();
        this.hasFetchedBusiness = true;
        this.businessService.updateBusiness(business);
      });
  }
}
