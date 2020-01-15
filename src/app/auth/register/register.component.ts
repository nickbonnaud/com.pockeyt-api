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
  selector: "register",
  styleUrls: ["./register.component.scss"],
  templateUrl: "./register.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = "";

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private businessService: BusinessService
  ) {
    this.redirectDelay = this.getConfigValue("forms.register.redirectDelay");
    this.showMessages = this.getConfigValue("forms.register.showMessages");
    this.strategy = this.getConfigValue("forms.register.strategy");
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service
      .register(this.strategy, this.user)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
          this.setErrors(result);
        }

        const redirect = result.getRedirect();
        if (redirect) {
          this.getBusiness(result.getResponse());
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

  setErrors(result: NbAuthResult): void {
    this.errors.push(result.getResponse().error.errors.email);
    this.errors.push(result.getResponse().error.errors.password);
  }

  getBusiness(response: HttpResponse<any>): void {
    const business: Business = response.body.business;
    this.businessService.updateBusiness(business);
  }
}
