import { Component, OnInit } from '@angular/core';
import { urls } from 'src/app/urls/main';

@Component({
  selector: 'recent-customers',
  templateUrl: './recent-customers.component.html',
  styleUrls: ['./recent-customers.component.scss']
})
export class RecentCustomersComponent implements OnInit {

  query: string;

  constructor() { }

  ngOnInit() {
    this.query = urls.query.customer_historic;
  }

}
