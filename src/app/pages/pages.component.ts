import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: "app-pages",
  styleUrls: ["./pages.component.scss"],
  template: `
    <app-main>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </app-main>
  `
})
export class PagesComponent {
  menu: NbMenuItem[] = [
    {
      title: "Home",
      icon: "home-outline",
      link: "home",
      home: true
    },
    {
      title: "Sales Center",
      icon: "shopping-cart-outline",
      link: "sales"
    },
    {
      title: "Customers Center",
      icon: "people-outline",
      link: "customers",
    }
  ];
}
