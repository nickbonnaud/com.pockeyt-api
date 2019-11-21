import { Component, OnInit } from '@angular/core';
import { urls } from 'src/app/urls/main';

@Component({
  selector: 'active-customers',
  templateUrl: './active-customers.component.html',
  styleUrls: ['./active-customers.component.scss']
})
export class ActiveCustomersComponent implements OnInit {

  query: string;

  constructor() { }

  ngOnInit() {
    this.query = urls.query.customer_active;
  }

}
