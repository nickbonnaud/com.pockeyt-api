import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { Business } from 'src/app/models/business/business';
import { ApiService } from 'src/app/services/api.service';
import { BusinessService } from 'src/app/services/business.service';
import { urls } from 'src/app/urls/main';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';
import { patterns } from 'src/app/forms/validators/patterns';

@Component({
  selector: "app-dashboard-account",
  templateUrl: "./dashboard-account.component.html",
  styleUrls: ["./dashboard-account.component.scss"]
})
export class DashboardAccountComponent implements OnInit, OnDestroy {
  @ViewChild("alert", { static: false }) private alert: SwalComponent;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  accountForm: FormGroup;
  business: Business;

  formLocked: boolean = false;
  loading: boolean = false;
  loadingPassCheck: boolean = false;
  correctCurrentPassword: boolean = false;
  editEmail: boolean = true;

  constructor(
    private api: ApiService,
    private businessService: BusinessService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.setForm();
  }

  buildForm(): void {
    this.accountForm = this.fb.group({
      email: ["", Validators.compose([Validators.email])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(patterns.password)])],
      newPassword: ["", Validators.compose([Validators.minLength(6), Validators.pattern(patterns.password)])],
      newPasswordMatch: [""],
    }, {validator: [this.matchPasswords, this.requiredIf] });
  }

  matchPasswords(group: FormGroup): { [key: string]: any } | null {
    let newPassword = group.get("newPassword").value;
    let passwordMatch = group.get("newPasswordMatch").value;
    newPassword = newPassword == undefined ? "" : newPassword;
    passwordMatch = passwordMatch == undefined ? "" : passwordMatch;

    return newPassword === passwordMatch ? null : { match: true };
  }

  requiredIf(group: FormGroup): { [key: string]: any } | null {
    let newPassword: string = group.get("newPassword").value;
    newPassword = newPassword == undefined ? "" : newPassword;

    let email: string = group.get('email').value;

    if (email.length == 0 && newPassword.length == 0) {
      return { requiredIf: true }
    }
    return null;
  }

  setForm(): void {
    this.business = this.businessService.business$.value;
    this.lockForm();
  }

  toggleLock(): void {
    this.formLocked ? this.unlockForm() : this.lockForm();
  }

  lockForm(): void {
    this.formLocked = !this.formLocked;
    this.accountForm.get("email").reset(this.business.email);
    this.accountForm.get("email").disable();

    this.accountForm.get("password").reset();
    this.accountForm.get("password").enable();

    this.accountForm.get("newPassword").reset();
    this.accountForm.get("newPassword").disable();

    this.accountForm.get("newPasswordMatch").reset();
    this.accountForm.get("newPasswordMatch").disable();

    this.correctCurrentPassword = undefined;
  }

  unlockForm(): void {
    if (this.correctCurrentPassword) {
      this.formLocked = !this.formLocked;

      this.accountForm.get("email").enable();

      this.accountForm.get("password").disable();

      this.accountForm.get("newPassword").reset();
      this.accountForm.get("newPassword").enable();

      this.accountForm.get("newPasswordMatch").reset();
      this.accountForm.get("newPasswordMatch").enable();
    } else {
      this.checkValidCurrentPassword().subscribe((res: any) => {
        this.loadingPassCheck = false;
        if (res.passwordVerified) {
          this.correctCurrentPassword = true;
          this.unlockForm();
        } else {
          this.showAlert("Invalid Current Password", "error");
        }
      });
    }
  }

  checkValidCurrentPassword(): Observable<any> {
    if (!this.loadingPassCheck) {
      this.loadingPassCheck = true;
      const formData = { password: this.accountForm.get("password").value };
      return this.api
        .post<any>(urls.auth.verify, formData)
        .pipe(takeUntil(this.destroyed$));
    }
  }

  submit(): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .patch<any>(
          urls.business.business_update,
          this.formatBody(),
          this.business.identifier
        )
        .pipe(takeUntil(this.destroyed$))
        .subscribe((response: any) => {
          if (this.editEmail) {
            this.business.email = response.email;
          }
          this.businessService.updateBusiness(this.business);

          this.loading = false;
          this.lockForm();
          this.showAlert(`Successfully updated ${this.editEmail ? 'email' : 'password'}!`, "success");
        });
    }
  }

  formatBody(): any {
    if (this.editEmail) {
      return { email: this.accountForm.get("email").value };
    }
    return {
      oldPassword: this.accountForm.get("password").value,
      password: this.accountForm.get("newPassword").value,
      passwordConfirmation: this.accountForm.get("newPasswordMatch").value
    };
  }

  showAlert(title: string, type: SweetAlertType): void {
    this.alert.update({
      text: title,
      type: type,
      timer: 3 * 1000,
      showConfirmButton: false
    });
    this.alert.fire();
  }

  toggleEdit(): void {
    this.editEmail = !this.editEmail;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
