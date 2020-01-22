import { PaginatorService } from './../../services/paginator.service';
import { takeUntil, tap } from 'rxjs/operators';
import { urls } from './../../urls/main';
import { ApiService } from './../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { Employee } from './../../models/employee/employee';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-employee-picker-dialog',
  templateUrl: './employee-picker-dialog.component.html',
  styleUrls: ['./employee-picker-dialog.component.scss']
})
export class EmployeePickerDialogComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  loading: boolean = false;
  BASE_URL: string = urls.business.employees;

  selectedEmployee: Employee;
  employees: Employee[] = [];

  constructor (
    private api: ApiService,
    private paginator: PaginatorService,
    protected ref: NbDialogRef<EmployeePickerDialogComponent>
  )
  {}

  ngOnInit() {
    this.fetchEmployees(this.BASE_URL);
  }

  fetchEmployees(url: string): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .get<Employee[]>(url)
        .pipe(
          tap(_ => {},
            err => this.loading = false
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((employees: Employee[]) => {
          this.employees.push(...employees);
          this.loading = false;

          const nextUrl: string = this.paginator.getNextUrl(this.BASE_URL);
          if (nextUrl != undefined) {
            this.fetchEmployees(nextUrl);
          }
        });
    }
  }

  cancel(): void {
    this.ref.close();
  }

  submit(): void {
    this.ref.close(this.selectedEmployee);
  }

  ngOnDestroy(): void {
    this.paginator.removePageData(this.BASE_URL);
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

}
