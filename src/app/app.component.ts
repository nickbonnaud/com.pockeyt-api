import { Component, OnDestroy } from '@angular/core';
import { RouteFinderService } from './services/route-finder.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from './services/api.service';
import { urls } from './urls/main';
import { Business } from './models/business/business';
import { BusinessService } from './services/business.service';

interface NavUrls {
  prev: string;
  nextOrCurrent: string;
}

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent {
  title: string = "dashboard-business";

  constructor () {}

}
