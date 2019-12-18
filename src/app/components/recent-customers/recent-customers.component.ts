import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { urls } from 'src/app/urls/main';

@Component({
  selector: "recent-customers",
  templateUrl: "./recent-customers.component.html",
  styleUrls: ["./recent-customers.component.scss"]
})
export class RecentCustomersComponent implements OnInit {
  query: string;
  loading: boolean = false;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.query = urls.query.customer_historic;
  }

  updateLoading(loading) {
    this.loading = loading;
    this.ref.detectChanges();
  }
}
