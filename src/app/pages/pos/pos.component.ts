import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { FormControlProviderService } from 'src/app/forms/services/form-control-provider.service';
import { BusinessService } from 'src/app/services/business.service';
import { urls } from 'src/app/urls/main';
import { PosAccount } from 'src/app/models/business/pos-account';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-pos",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.scss"]
})
export class PosComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  posForm: FormGroup;
  posAccount: PosAccount;

  formLocked: boolean = true;
  loading: boolean = false;
  BASE_URL: string;

  constructor(
    private api: ApiService,
    private fcProvider: FormControlProviderService,
    private businessService: BusinessService
  ) {}

  ngOnInit() {
    this.BASE_URL = urls.business.pos_store_patch_get;
    this.posForm = this.fcProvider.registerPosTypeControls();
    this.fetchPosData();
  }

  fetchPosData(): void {
    this.setPosForm(this.businessService.business$.value.posAccount);
    this.posForm.disable();
  }

  setPosForm(posAccount: PosAccount): void {
    this.posAccount = posAccount;
    let posFormData = Object.assign({}, posAccount);
    delete posFormData["identifier"];
    delete posFormData["status"];

    this.posForm.setValue(posFormData);
  }

  toggleLock(): void {
    this.formLocked = !this.formLocked;
    this.posForm.disabled ? this.posForm.enable() : this.posForm.disable();
    if (this.formLocked) {
      this.setPosForm(this.posAccount);
    }
  }

  submit(): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .patch<PosAccount>(this.BASE_URL, this.posForm.value, this.posAccount.identifier)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((posAccount: PosAccount) => {
          this.businessService.updatePosAccount(posAccount);
          this.setPosForm(posAccount);
          this.toggleLock();
          this.loading = false;
        })
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
