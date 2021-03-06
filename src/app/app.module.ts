import { LayoutModule } from './layout/layout.module';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbActionsModule, NbUserModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClientModule } from '@angular/common/http';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken, NbAuthSimpleToken } from '@nebular/auth';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { HttpInterceptorProviders } from './interceptors';
import { urls } from './urls/main';
import { patterns } from './forms/validators/patterns';
import { environment } from 'src/environments/environment';


export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbActionsModule,
    NbUserModule,
    HttpClientModule,
    LayoutModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbSidebarModule.forRoot(),
    NgxMaskModule.forRoot(options),
    NbToastrModule.forRoot(),

    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: "email",
          token: {
            class: NbAuthJWTToken,
            key: "token"
          },
          baseEndpoint: environment.base_url,
          login: {
            endpoint: urls.auth.login,
            method: "post",
            redirect: {
              success: "/dashboard/home?",
              failure: null
            }
          },
          register: {
            endpoint: urls.auth.register,
            method: "post",
            redirect: {
              success: "/dashboard/onboard",
              failure: null
            }
          },
          requestPass: {
            endpoint: urls.auth.request_reset,
            method: "post",

            redirect: {
              success: "/auth/login",
              failure: null
            }
          },
          resetPass: {
            endpoint: urls.auth.reset_password,
            method: "patch",
            redirect: {
              success: "/auth/login",
              failure: null
            },
            resetPasswordTokenKey: "token"
          }
        })
      ],
      forms: {
        login: {
          redirectDelay: 0,
          rememberMe: false
        },
        register: {
          redirectDelay: 0
        },
        requestPassword: {
          redirectDelay: 4000
        },
        validation: {
          password: {
            minLength: 6,
            maxLength: 100,
            regexp: patterns.password
          }
        }
      }
    })
  ],
  providers: [AuthGuardService, HttpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {}
