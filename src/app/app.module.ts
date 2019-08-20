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
import { environment } from 'src/environments/environment';
import { IConfig, NgxMaskModule } from 'ngx-mask';


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
          baseEndpoint: environment.urls.base,

          login: {
            endpoint: environment.urls.login,
            method: 'post'
          },
          register: {
            endpoint: environment.urls.register,
            method: 'post',
            redirect: {
              success: '/welcome',
              failure: null
            }
          },
          logout: {
            endpoint: environment.urls.logout,
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
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {}
