import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, CommonModule],
  templateUrl: './date-picker.component.html',
  styles: [
    `
      
      .bi-calendar3 {
        margin-left: 50px;
      }
      .custom-day {
        text-align: center;
        padding: 0.185rem 0.25rem;
        border-radius: 0.25rem;
        display: inline-block;
        width: 2rem;
      }
      .custom-day:hover,
      .custom-day.focused {
        background-color: #e6e6e6;
      }
      .weekend {
        background-color: #f0ad4e;
        border-radius: 1rem;
        color: white;
      }
      .hidden {
        display: none;
      }
    `,
  ],
})
export class DatePickerComponent {
  private calendar = inject(NgbCalendar);

  model: NgbDateStruct | null | undefined;
  @Output() dateSelected = new EventEmitter<NgbDateStruct | null>();

  isWeekend(date: NgbDate): boolean {
    return this.calendar.getWeekday(date) >= 6;
  }

  onDateSelect() {
    this.dateSelected.emit(this.model);
  }

  clearDate() {
    this.model = null;
    this.dateSelected.emit(null);
  }
}
