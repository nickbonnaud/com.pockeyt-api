import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { urls } from 'src/app/urls/main';

@Component({
  selector: "active-customers",
  templateUrl: "./active-customers.component.html",
  styleUrls: ["./active-customers.component.scss"]
})
export class ActiveCustomersComponent implements OnInit {
  query: string;
  loading: boolean = false

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.query = urls.query.customer_active;
  }

  updateLoading(loading) {
    this.loading = loading;
    this.ref.detectChanges();
  }
}
