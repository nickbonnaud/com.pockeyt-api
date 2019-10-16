import { urls } from './../../urls/main';
import { PaginatorService } from 'src/app/services/paginator.service';
import { ApiService } from './../../services/api.service';
import { Subject } from 'rxjs/internal/Subject';
import { NbCalendarRange, NbDateService } from '@nebular/theme';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

interface Employee {
  firstName: string;
  lastName: string;
  tips: number;
}

interface Period {
  title: string;
  value: number;
}

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  periods: Period[] = [
    { title: 'Day', value: 1 },
    { title: 'Week', value: 7 },
    { title: 'Month', value: 30 },
    { title: 'Custom', value: null }
  ];
  period: Period = this.periods[0];
  BASE_URL: string;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  range: NbCalendarRange<Date>;
  employees: Employee[] = [];
  loading: boolean = false;
  flipped: boolean = false;

  constructor(
    private api: ApiService,
    private paginator: PaginatorService,
    private dateService: NbDateService<Date>
  )
  {}

  ngOnInit(): void {
    this.BASE_URL = `${urls.business.tips}?${urls.query.employees_tips}`;
    this.changeStartDate();
  }

  changePeriod(selection: Period): void {
    this.period = selection;
    this.flipped = selection.value == null;
    this.changeStartDate();
  }

  changeStartDate(): void {
    if (this.period.value != null) {
      this.range = {
        start: this.formatStartDate(this.period.value),
        end: this.dateService.today()
      };
      const url: string = this.addDateQuery(this.range);
      this.fetchEmployeeTips(url, false);
    }
  }

  rangeChanged(range: NbCalendarRange<Date>): void {
    if (range.start != undefined && range.end != undefined) {
      this.flipped = false;
      const url: string = this.addDateQuery(range);
      this.fetchEmployeeTips(url, false);
    }
  }

  formatStartDate(daysAgo: number): Date {
    let date = this.dateService.today();
    date.setHours(0, 0, 0, 0);
    return this.dateService.addDay(date, -daysAgo);
  }

  addDateQuery(range: NbCalendarRange<Date>): string {
    return `${this.BASE_URL}&date[]=${encodeURIComponent(
      range.start.toISOString()
    )}&date[]=${encodeURIComponent(range.end.toISOString())}`;
  }

  fetchEmployeeTips(url: string, isPaginate: boolean): void {
    this.loading = true;
    if (!isPaginate) {
      this.employees = [];
    }
    this.api
      .get<Employee[]>(url)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((employees: Employee[]) => {
        this.employees.push(...employees);
        this.loading = false;
      });
  }

  getMoreEmployeeTips(): void {
    if (this.loading) {
      return;
    }

    const nextUrl: string = this.paginator.getNextUrl(this.BASE_URL);
    if (nextUrl != undefined) {
      this.fetchEmployeeTips(nextUrl, true);
    }
  }

  trackByFn(index: number, employee: Employee): number {
    if (!employee) {
      return null;
    }
    return index;
  }

  ngOnDestroy(): void {
    this.paginator.removePageData(this.BASE_URL);
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
