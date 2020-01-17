import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlProviderService } from 'src/app/forms/services/form-control-provider.service';
import { BusinessAccount } from 'src/app/models/business/business-account';
import { ApiService } from 'src/app/services/api.service';
import { urls } from 'src/app/urls/main';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/models/business/business';

@Component({
  selector: 'app-business-data',
  templateUrl: './business-data.component.html',
  styleUrls: ['./business-data.component.scss']
})
export class BusinessDataComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  businessForm: FormGroup;
  business: Business;

  formLocked: boolean = true;
  loading: boolean = false;
  BASE_URL: string;

  constructor (
    private fcProvider: FormControlProviderService,
    private api: ApiService,
    private businessService: BusinessService
  ) { }

  ngOnInit() {
    this.BASE_URL = urls.business.account_store_patch;
    this.businessForm = this.fcProvider.registerBusinessControls();
    this.fetchBusinessAccount();
  }

  fetchBusinessAccount(): void {
    this.setBusinessForm(this.businessService.business$.value);
    this.businessForm.disable();
  }

  setBusinessForm(business: Business): void {
    this.business = business;
    let businessAccount = Object.assign({}, business.accounts.businessAccount);
    delete businessAccount['identifier'];

    let businessAddress = businessAccount.address;
    delete businessAccount['address'];
    businessAccount = Object.assign({}, businessAccount, businessAddress);
    this.businessForm.setValue(businessAccount);
  }

  toggleLock(): void {
    this.setLock();
    if (this.formLocked) {
      this.setBusinessForm(this.business)
    }
  }

  setLock(): void {
    this.formLocked = !this.formLocked;
    this.businessForm.disabled
      ? this.businessForm.enable()
      : this.businessForm.disable();
  }

  submit(): void {
    if (!this.loading) {
      this.loading = true;
      const id: string = this.business.accounts.businessAccount.identifier;
      this.api
        .patch<BusinessAccount>(this.BASE_URL, this.businessForm.value, id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((businessAccount: BusinessAccount) => {

          let business = this.business;
          business.accounts.businessAccount = businessAccount;

          this.businessService.updateAccounts(business.accounts.businessAccount, business.accounts.ownerAccounts, business.accounts.bankAccount);
          this.setBusinessForm(business);
          this.setLock();
          this.loading = false;
        })
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

}
