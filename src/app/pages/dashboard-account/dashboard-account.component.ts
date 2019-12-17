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
import { AuthService } from 'src/app/services/auth.service';
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
  correctCurrentPassword: boolean = false;

  constructor(
    private api: ApiService,
    private businessService: BusinessService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.setForm();
  }

  buildForm(): void {
    this.accountForm = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern(patterns.password)])],
      newPassword: ["", Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern(patterns.password)])],
      newPasswordMatch: [""],
    }, {validator: this.matchPasswords });
  }

  matchPasswords(group: FormGroup): { [key: string]: any } | null {
    let newPassword = group.get("newPassword").value;
    let passwordMatch = group.get("newPasswordMatch").value;
    return newPassword === passwordMatch ? null : { match: true };
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
        this.loading = false;
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
    if (!this.loading) {
      this.loading = true;
      const formData = { password: this.accountForm.get("password").value };
      return this.api
        .post<any>(urls.auth.verify, formData)
        .pipe(takeUntil(this.destroyed$));
    }
  }

  submit(): void {
    if (!this.loading) {
      this.loading = true;
      const formData: any = {
        email: this.accountForm.get("email").value,
        oldPassword: this.accountForm.get("password").value,
        password: this.accountForm.get("newPassword").value
      };
      this.api
        .patch<any>(
          urls.business.business_update,
          formData
        )
        .pipe(takeUntil(this.destroyed$))
        .subscribe((loginData: any) => {
          this.business.email = loginData.email;
          this.business.token = loginData.token.value;
          this.businessService.updateBusiness(this.business);
          this.authService.setToken(loginData.token);
          this.loading = false;
          this.lockForm();
          this.showAlert('Successfully updated login', 'success');
        });
    }
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
