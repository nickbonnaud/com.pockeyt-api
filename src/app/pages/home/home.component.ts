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
    private businessService: BusinessService
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
        this.getPosAccount()
          .pipe(takeUntil(this.destroyed$))
          .subscribe((posAccount: PosAccount) => {
            this.showOauthAlert(posAccount, params);
            this.removeQueryParams();
            this.businessService.updatePosAccount(posAccount);
          });
      });
  }

  showOauthAlert(posAccount: PosAccount, params: Params): void {
    if (params.oauth === 'success') {
      if (posAccount.status.code === 100 && this.business.posAccount.status.code !== 100) {
        const title = 'Success! Onboarding Complete!';
        this.showSuccessAlert(title);
      }
    } else if (params.oauth === 'fail') {
      if (posAccount.status.code == 500) {
        const title = 'Oops! Something went wrong connecting your XXXX account!';
        this.showFailAlert(title);
      }
    }
  }

  getPosAccount(): Observable<PosAccount> {
    return this.api.get<PosAccount>(urls.business.pos_store_patch_get);
  }

  showSuccessAlert(title: string): void {
    this.oauthAlert.update({
      text: title,
      type: 'success',
      timer: 4 * 1000,
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
