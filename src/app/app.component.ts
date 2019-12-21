import { Component } from '@angular/core';
import { RouteFinderService } from './services/route-finder.service';


@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent {
  constructor(private routeFinderService: RouteFinderService) {}

  title = "dashboard-business";
}
