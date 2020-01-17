import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormControlProviderService } from 'src/app/forms/services/form-control-provider.service';
import { Owner } from 'src/app/models/business/owner';
import { BusinessService } from 'src/app/services/business.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { ConfirmOrCancelDialogComponent } from 'src/app/dialogs/confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { urls } from 'src/app/urls/main';
import { ApiService } from 'src/app/services/api.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WarningDialogComponent } from 'src/app/dialogs/warning-dialog/warning-dialog.component';
import { numberValidator } from 'src/app/forms/validators/number-validator';

@Component({
  selector: "app-owners",
  templateUrl: "./owners.component.html",
  styleUrls: ["./owners.component.scss"]
})
export class OwnersComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  ownerForm: FormGroup;

  owners: Owner[] = [];
  ownersToUpdate: Owner[] = [];
  selectedOwner: Owner;

  formLocked: boolean = true;
  loading: boolean = false;
  loadingDelete: boolean = false;
  BASE_URL: string;

  constructor(
    private fcProvider: FormControlProviderService,
    private businessService: BusinessService,
    private dialogService: NbDialogService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.BASE_URL = urls.business.owner_store_patch;
    this.fetchOwners();
    this.ownerForm = this.fcProvider.updateOwnerControls(this.owners);
    this.ownerForm.disable();
    this.watchPrimary();
  }

  ngAfterViewInit(): void {
    this.setPercentOwnValidator();
  }

  setPercentOwnValidator(): void {
    let percentOwn = this.ownerForm.get("percentOwnership");
    percentOwn.setValidators([Validators.required, numberValidator, this.percentOwn.bind(this)]);
    percentOwn.updateValueAndValidity({onlySelf:true});

  }

  percentOwn(): { [key: string]: any } | null {
    let total = 0;
    this.owners.forEach(owner => {
      if (owner.identifier != this.selectedOwner.identifier) {
        const percentOwn: number = typeof owner.percentOwnership === 'string' ? parseInt(owner.percentOwnership) : owner.percentOwnership;
        total = total + percentOwn;
      }
    });
    if (total + parseInt(this.ownerForm.get("percentOwnership").value) > 100) {
      return { percentOwn: true };
    }
    return null;
  }

  fetchOwners(): void {
    this.owners = this.businessService.business$.value.accounts.ownerAccounts;
  }

  selectOwner(owner: Owner): void {
    if (!this.formLocked) {
      this.toggleLock();
    }
    this.selectedOwner = owner;
  }

  watchPrimary(): void {
    this.ownerForm
      .get("primary")
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((isPrimary: boolean) => this.checkPrimary(isPrimary));
  }

  checkPrimary(isPrimary: boolean): void {
    if (isPrimary) {
      this.markPrimaryAsTouched();
      this.showChangePrimaryWarning();
    } else {
      this.showAssignPrimaryWarning();
    }
  }

  markPrimaryAsTouched(): void {
    if (!this.ownerForm.get("primary").touched) {
      this.ownerForm.get("primary").markAsTouched();
    }
  }

  showAssignPrimaryWarning(): void {
    if (this.selectedOwner != undefined) {
      const index: number = this.owners.findIndex((owner: Owner) => {
        return (
          owner.primary && owner.identifier !== this.selectedOwner.identifier
        );
      });
      if (index == -1) {
        this.dialogService.open(WarningDialogComponent, {
          context: {
            title: "Change Primary Owner",
            body:
              "Please select another Owner as the Primary to change Primary Owners."
          }
        });
        this.ownerForm.get("primary").setValue(true);
      }
    }
  }

  showChangePrimaryWarning(): void {
    const prevPrimaryOwner: Owner = this.owners.find((owner: Owner) => {
      return owner.primary;
    });
    if (
      prevPrimaryOwner != undefined && this.selectedOwner != undefined &&
      this.selectedOwner.identifier != prevPrimaryOwner.identifier
    ) {
      const newPrimaryFirst = this.selectedOwner.firstName == undefined ? (this.ownerForm.get('firstName').value == undefined ? 'new' : this.ownerForm.get('firstName').value) : this.selectedOwner.firstName;
      const newPrimaryLast = this.selectedOwner.lastName == undefined ? (this.ownerForm.get('lastName').value == undefined ? 'owner' : this.ownerForm.get('lastName').value) : this.selectedOwner.lastName;
      this.dialogService
        .open(ConfirmOrCancelDialogComponent, {
          closeOnBackdropClick: false,
          context: {
            title: "Primary Owner already assigned!",
            body: `Change the Primary Owner from ${prevPrimaryOwner.firstName} ${prevPrimaryOwner.lastName} to ${newPrimaryFirst} ${newPrimaryLast}?`
          }
        })
        .onClose.pipe(takeUntil(this.destroyed$))
        .subscribe((changePrimary: boolean) => {
          if (changePrimary) {
            prevPrimaryOwner.primary = false;
            this.ownersToUpdate.push(prevPrimaryOwner);
          } else {
            this.ownerForm.get("primary").setValue(false);
          }
        });
    }
  }

  toggleLock(): void {
    this.formLocked = !this.formLocked;
    this.ownerForm.disabled
      ? this.ownerForm.enable()
      : this.ownerForm.disable();
    if (this.formLocked && this.selectedOwner != undefined) {
      this.selectedOwner = this.selectedOwner;
    }
  }

  submit(): void {
    if (!this.loading && !this.loadingDelete) {
      this.loading = true;
      let ownersObservable: Observable<Owner>[] = [];

      if (this.selectedOwner.identifier != undefined) {
        ownersObservable.push(
          this.sendPatch(this.ownerForm.value, this.selectedOwner.identifier)
        );
      } else {
        ownersObservable.push(this.sendPost(this.ownerForm.value));
      }
      this.ownersToUpdate.forEach((owner: Owner) => {
        ownersObservable.push(
          this.sendPatch(this.formatOwnersData(owner), owner.identifier)
        );
      });
      forkJoin(ownersObservable)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((owners: Owner[]) => {
          owners.forEach((owner: Owner) => {
            this.setNewOwnerValue(owner);
          });
          this.endSubmit();
        });
    }
  }

  sendPatch(formData: any, id: string): Observable<Owner> {
    return this.api.patch<Owner>(this.BASE_URL, formData, id);
  }

  sendPost(formData: any): Observable<Owner> {
    return this.api.post<Owner>(this.BASE_URL, formData);
  }

  endSubmit(): void {
    this.selectedOwner = undefined;
    this.ownersToUpdate = [];
    this.toggleLock();
    this.loading = false;
    this.loadingDelete = false;
  }

  setNewOwnerValue(newOwnerValue: Owner): void {
    let index: number = this.owners.findIndex((owner: Owner) => {
      return newOwnerValue.identifier === owner.identifier;
    });
    if (index >= 0) {
      this.owners[index] = newOwnerValue;
    } else {
      this.owners.push(newOwnerValue);
    }
  }

  formatOwnersData(owner: Owner): any {
    let ownerData = Object.assign({}, owner);
    delete ownerData["identifier"];

    let ownerAddress = ownerData.address;
    delete ownerData["address"];

    ownerData = Object.assign({}, ownerData, ownerAddress);
    return ownerData;
  }

  trackByFn(index: number, owner: Owner): number {
    if (!owner) {
      return null;
    }
    return index;
  }

  deleteOwner(): void {
    if (this.selectedOwner.primary) {
      this.dialogService.open(WarningDialogComponent, {
        context: {
          title:
            this.owners.length > 1
              ? "Change Primary Owner"
              : "Add new Primary Owner",
          body:
            this.owners.length > 1
              ? `Please change the Primary Owner before deleting ${this.selectedOwner.firstName} ${this.selectedOwner.lastName}.`
              : `Please add another Owner who is the Primary before deleting ${this.selectedOwner.firstName} ${this.selectedOwner.lastName}.`
        }
      });
    } else {
      this.dialogService
        .open(ConfirmOrCancelDialogComponent, {
          closeOnBackdropClick: false,
          context: {
            title: "Remove Owner?",
            body: `Are you sure you want to remove ${this.selectedOwner.firstName} ${this.selectedOwner.lastName} as an Owner?`
          }
        })
        .onClose.pipe(takeUntil(this.destroyed$))
        .subscribe((deleteOwner: boolean) => {
          if (deleteOwner) {
            this.sendDelete();
          }
        });
    }
  }

  sendDelete(): void {
    if (!this.loadingDelete && !this.loadingDelete) {
      this.loadingDelete = true;
      this.api
        .delete<any>(this.BASE_URL, [], this.selectedOwner.identifier)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          if (response.success) {
            let index: number = this.owners.findIndex((owner: Owner) => {
              return owner.identifier === this.selectedOwner.identifier;
            });
            this.owners.splice(index, 1);
            this.endSubmit();
            this.selectedOwner = this.owners[0];
          }
        });
    }
  }

  addOwner(): void {
    this.selectedOwner = new Owner();
    this.ownerForm.reset();
    this.toggleLock();
  }

  cancelNew(): void {
    this.toggleLock();
    this.selectedOwner = this.owners[0];
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
