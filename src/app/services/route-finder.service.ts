import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';

interface NavUrls {
  prev: string;
  nextOrCurrent: string;
}

@Injectable({
  providedIn: "root"
})
export class RouteFinderService {
  urlChanging$: Subject<NavUrls> = new Subject<NavUrls>();
  private urlHistory: NavUrls = {
    prev: "",
    nextOrCurrent: ""
  };

  constructor(private router: Router) {
    this.urlHistory.nextOrCurrent = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const urls: NavUrls = {
          prev: this.urlHistory.nextOrCurrent,
          nextOrCurrent: event.url
        }

        this.urlChanging$.next(urls);
      } else if (event instanceof NavigationEnd) {
        this.urlHistory.prev = this.urlHistory.nextOrCurrent;
        this.urlHistory.nextOrCurrent = event.url;
      }
    });
  }

  public getPreviousUrl(): string {
    return this.urlHistory.prev;
  }

  public getCurrentUrl(): string {
    return this.urlHistory.nextOrCurrent;
  }
}
