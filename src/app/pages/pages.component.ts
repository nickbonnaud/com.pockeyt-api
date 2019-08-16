import { Component } from '@angular/core';

@Component({
  selector: 'app-pages',
  styleUrls: ['./pages.component.scss'],
  template: `
    <app-main>
      <router-outlet></router-outlet>
    </app-main>
  `
})
export class PagesComponent {
  constructor() {}

}
