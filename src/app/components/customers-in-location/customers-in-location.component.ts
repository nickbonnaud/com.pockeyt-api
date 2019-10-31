import { NbCalendarRange } from '@nebular/theme';
import { urls } from './../../urls/main';
import { Component, OnInit } from '@angular/core';

interface SelectionOption {
  title: string;
  statusQuery: string;
  value: string;
}

@Component({
  selector: 'customers-in-location',
  templateUrl: './customers-in-location.component.html',
  styleUrls: ['./customers-in-location.component.scss']
})
export class CustomersInLocationComponent implements OnInit {
  selectionOptions: SelectionOption[] = [
    {
      title: 'Current Customers',
      statusQuery: urls.query.customer_active,
      value: 'active'
    },
    {
      title: 'Historic Customers',
      statusQuery: urls.query.customer_historic,
      value: 'historic'
    }
  ];

  filterOptions: SelectionOption[] = [
    {
      title: 'With Transaction',
      statusQuery: `&${urls.query.customer_with_transaction}`,
      value: 'with_transaction'
    },
    {
      title: 'Without Transaction',
      statusQuery: `&${urls.query.customer_without_transaction}`,
      value: 'without_transaction'
    }
  ];

  flipped: boolean = false;
  selectedStatus: SelectionOption = this.selectionOptions[0];
  selectedFilter: SelectionOption;
  range: NbCalendarRange<Date>;

  baseQuery: string;
  transactionQuery: string = '';
  dateQuery: string = '';
  fullQuery: string = '';

  constructor() {}

  ngOnInit() {
    this.baseQuery = this.selectedStatus.statusQuery;
    this.setFullQuery();
  }

  changeStatusSelection(selection: SelectionOption): void {
    this.selectedStatus = selection;
    this.baseQuery = selection.statusQuery;
    if (selection.value === 'active' && this.flipped) {
      this.flipped = false;
    }
    this.dateQuery = '';
    this.transactionQuery = '';
    this.setFullQuery();
  }

  changeFilterSelection(selection: SelectionOption): void {
    this.selectedFilter = selection;
    this.transactionQuery = selection.statusQuery;
    this.setFullQuery();
  }

  showDatePicker(): void {
    this.flipped = true;
  }

  clearDates(): void {
    this.range = {
      start: undefined,
      end: undefined
    }
    this.dateQuery = '';
    this.flipped = false;
    this.setFullQuery();
  }

  setFullQuery(): void {
    this.fullQuery = this.baseQuery + this.transactionQuery + this.dateQuery;
  }

  dateRangeChanged(range: NbCalendarRange<Date>): void {
    this.range = range;
    if (range.start != undefined && range.end != undefined) {
      this.flipped = false;
      this.addDateRangeToQuery(range);
    }
  }

  addDateRangeToQuery(range: NbCalendarRange<Date>): void {
    this.dateQuery = `&${urls.query.date}${encodeURIComponent(range.start.toISOString())}&${urls.query.date}${
      encodeURIComponent(range.end.toISOString())
    }`;
    this.setFullQuery();
  }
}
