import { Business } from './../../models/business/business';
import { urls } from 'src/app/urls/main';
import { ApiService } from './../../services/api.service';
import { PosAccount } from './../../models/business/pos-account';
import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { BusinessService } from 'src/app/services/business.service';
import { RouteFinderService } from 'src/app/services/route-finder.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('oauthAlert', { static: false }) private oauthAlert: SwalComponent;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  business: Business;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private businessService: BusinessService,
    private routeFinder: RouteFinderService
  ) {}

  ngOnInit(): void {
    this.watchBusiness();
  }

  watchBusiness(): void {
    this.businessService.business$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((business: Business) => {
        this.business = business;
      });
  }

  ngAfterViewInit(): void {
    this.watchQueryParams();
  }

  watchQueryParams(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        filter((params: Params) => params.oauth)
      )
      .subscribe((params: Params) => {
        this.showOauthAlert(params);
        this.removeQueryParams();
      });
  }

  showOauthAlert(params: Params): void {
    console.log(this.routeFinder.getPreviousUrl());
    if (params.oauth === 'success' && this.routeFinder.getPreviousUrl() == '/dashboard/onboard') {
      const title = "Success! Onboarding Complete!";
      this.showSuccessAlert(title);
    } else if (params.oauth === 'fail') {
      const title = `Oops! Something went wrong connecting your ${this.business.posAccount.type} account!`;
      this.showFailAlert(title);
    }
  }

  getPosAccount(): Observable<PosAccount> {
    return this.api.get<PosAccount>(urls.business.pos_store_patch_get);
  }

  showSuccessAlert(title: string): void {
    this.oauthAlert.update({
      text: title,
      type: 'success',
      timer: 5 * 1000,
      showConfirmButton: false
    });
    this.oauthAlert.fire();
  }

  showFailAlert(title: string): void {
    this.oauthAlert.update({
      text: title,
      type: 'error',
    });
    this.oauthAlert.fire();
  }

  removeQueryParams(): void {
    let url: string = this.router.url.substring(0, this.router.url.indexOf('?'));
    this.router.navigateByUrl(url);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
