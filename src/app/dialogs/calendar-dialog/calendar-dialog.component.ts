import { Component, Input } from '@angular/core';
import { NbDialogRef, NbCalendarRange } from '@nebular/theme';

@Component({
  selector: 'calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss']
})
export class CalendarDialogComponent {
  @Input() title: string;
  @Input() range: NbCalendarRange<Date>;

  constructor(protected ref: NbDialogRef<CalendarDialogComponent>) { }

  cancel(): void {
    this.ref.close();
  }

  rangeChanged(range: NbCalendarRange<Date>): void {
    if (range.start != undefined && range.end != undefined) {
      this.ref.close(range);
    }
  }

}
