import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Bank } from 'src/app/models/business/bank';
import { urls } from 'src/app/urls/main';
import { ApiService } from 'src/app/services/api.service';
import { FormControlProviderService } from 'src/app/forms/services/form-control-provider.service';
import { BusinessService } from 'src/app/services/business.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { Business } from 'src/app/models/business/business';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  bankForm: FormGroup;
  bank: Bank;

  formLocked: boolean = true;
  loading: boolean = false;
  BASE_URL: string;

  constructor (
    private api: ApiService,
    private fcProvider: FormControlProviderService,
    private businessService: BusinessService
  ) {}

  ngOnInit() {
    this.BASE_URL = urls.business.bank_store_patch;
    this.bankForm = this.fcProvider.UpdateBankControls();
    this.fetchBank();
  }

  fetchBank(): void {
    this.setBankForm(this.businessService.business$.value.accounts.bankAccount);
    this.bankForm.disable();
  }

  setBankForm(bank: Bank): void {
    this.bank = bank;

    let bankAccount = Object.assign({}, bank);
    delete bankAccount["identifier"];

    let bankAddress = bank.address;
    delete bankAccount['address'];

    bankAccount = Object.assign({}, bankAccount, bankAddress);
    this.bankForm.setValue(bankAccount);
  }

  toggleLock(): void {
    this.formLocked = !this.formLocked;
    this.bankForm.disabled ? this.bankForm.enable() : this.bankForm.disable();
    if (this.formLocked) {
      this.setBankForm(this.bank);
    }
  }

  submit(): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .patch<Bank>(this.BASE_URL, this.bankForm.value, this.bank.identifer)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((bank: Bank) => {
          let business: Business = this.businessService.business$.value;
          this.businessService.updateAccounts(business.accounts.businessAccount, business.accounts.ownerAccounts, bank);
          this.setBankForm(bank);
          this.toggleLock();
          this.cleanForm();
          this.loading = false;
        });
    }
  }

  cleanForm(): void {
    this.bankForm.markAsPristine();
    this.bankForm.markAsUntouched();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

}
