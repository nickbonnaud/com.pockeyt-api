import { Component, Input } from '@angular/core';
import { NbDialogRef } from "@nebular/theme";
import { HOURS_SELECT } from "src/assets/data/hours-select";

@Component({
  selector: "app-time-picker-dialog",
  templateUrl: "./time-picker-dialog.component.html",
  styleUrls: ["./time-picker-dialog.component.scss"]
})
export class TimePickerDialogComponent {
  @Input() day: string;
  selectedStartTime;
  selectedEndTime;
  selectedStartPeriod;
  selectedEndPeriod;

  operatingHours: any[] = HOURS_SELECT;
  amPmSelect: any[] = [
    { period: "AM", value: "AM" },
    { period: "PM", value: "PM" }
  ];

  constructor(protected ref: NbDialogRef<TimePickerDialogComponent>) {}

  openChanged(hour: string): void {
    if (hour == "closed") {
      this.submitClosed();
    }
  }
  closedChanged(hour: string): void {
    if (hour == "closed") {
      this.submitClosed();
    }
  }

  cancel(): void {
    this.ref.close();
  }

  submit(): void {
    this.ref.close(this.formatTime());
  }

  formatTime(): string {
    return `${this.day}: ${this.selectedStartTime} ${this.selectedStartPeriod} - ${this.selectedEndTime} ${this.selectedEndPeriod}`;
  }

  submitClosed(): void {
    this.ref.close(`${this.day}: Closed`);
  }
}

