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
      link: "customers"
    },
    {
      title: "Accounts",
      group: true
    },
    {
      title: "Account Details",
      icon: "settings-outline",
      children: [
        {
          title: "Profile",
          link: "account/profile"
        },
        {
          title: "Logo & Banner",
          link: "account/photos"
        },
        {
          title: "Business Info",
          link: "account/business-data"
        },
        {
          title: "Owners",
          link: "account/owners"
        },
        {
          title: "Banking",
          link: "account/banking"
        }
      ]
    }
  ];
}
