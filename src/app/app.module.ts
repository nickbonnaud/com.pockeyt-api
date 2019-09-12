import { AuthService } from './services/auth.service';
import { LayoutModule } from './layout/layout.module';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbActionsModule, NbUserModule, NbMenuModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClientModule } from '@angular/common/http';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken } from '@nebular/auth';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { HttpInterceptorProviders } from './interceptors';
import { urls } from './urls/main';


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
    NbMenuModule,
    HttpClientModule,
    LayoutModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbSidebarModule.forRoot(),
    NgxMaskModule.forRoot(options),

    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            class: NbAuthJWTToken,

            key: 'data.token.value'
          },

          login: {
            endpoint: urls.auth.login,
            method: 'post'
          },
          register: {
            endpoint: urls.auth.register,
            method: 'post',
            redirect: {
              success: '/welcome',
              failure: null
            }
          },
          logout: {
            endpoint: urls.auth.logout,
            method: 'get'
          }
        })
      ],
      forms: {
        login: {
          rememberMe: false
        },
        validation: {
          password: {
            minLength: 6
          }
        }
      }
    })
  ],
  providers: [AuthGuardService, AuthService, HttpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {}
