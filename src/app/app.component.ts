import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil, tap } from 'rxjs/operators';
import { ApiService } from './services/api.service';
import { urls } from './urls/main';
import { Business } from './models/business/business';
import { BusinessService } from './services/business.service';
import { NbAuthService, NbTokenService, NbAuthJWTToken } from '@nebular/auth';
import { forkJoin } from 'rxjs';
import { StorageService } from './services/storage.service';


@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  title: string = "dashboard-business";
  loading: boolean = false;

  constructor(
    private authService: NbAuthService,
    private tokenService: NbTokenService,
    private businessService: BusinessService,
    private storageService: StorageService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    forkJoin([this.authService.isAuthenticated(), this.tokenService.get()])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: [boolean, NbAuthJWTToken]) => {
        const isAuthenticated: boolean = data[0];
        const token: NbAuthJWTToken = data[1];
        this.getBusiness(isAuthenticated, token);
      });
  }

  getBusiness(isAuthenticated: boolean, token: NbAuthJWTToken): void {
    if (isAuthenticated && token.isValid()) {
      this.fetchFromStorage();
      this.fetchCurrent();
    }
  }

  fetchFromStorage(): void {
    this.businessService.updateBusiness(this.storageService.get());
  }

  fetchCurrent(): void {
    if (!this.loading) {
      this.loading = true;
      this.api.get<Business>(urls.business.me)
        .pipe(
          tap(_ => {},
            err => this.loading = false
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((business: Business) => {
          this.loading = false;
          this.storageService.set(business);
          this.businessService.updateBusiness(business);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
