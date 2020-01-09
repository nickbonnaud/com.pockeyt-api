import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject
} from "@angular/core";
import { Router } from "@angular/router";
import { NbAuthService, NB_AUTH_OPTIONS, NbAuthResult, getDeepFromObject } from '@nebular/auth';
import { HttpResponse } from '@angular/common/http';
import { Business } from 'src/app/models/business/business';
import { BusinessService } from 'src/app/services/business.service';


@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = "";

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  rememberMe = false;

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private businessService: BusinessService
  ) {
    this.redirectDelay = this.getConfigValue("forms.login.redirectDelay");
    this.showMessages = this.getConfigValue("forms.login.showMessages");
    this.strategy = this.getConfigValue("forms.login.strategy");
    this.rememberMe = this.getConfigValue("forms.login.rememberMe");
  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service
      .authenticate(this.strategy, this.user)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;

        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        const redirect = this.getRedirect(result);
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  getRedirect(result: NbAuthResult): string {
    const business: Business = this.getBusiness(result.getResponse());
    const redirect: string = result.getRedirect();
    if (redirect && business.accounts.accountStatus.code < 120) {
      return '/dashboard/onboard';
    }
    return redirect;
  }

  getBusiness(response: HttpResponse<any>): Business {
    const business: Business = response.body.business;
    this.businessService.updateBusiness(business);
    return business;
  }
}
