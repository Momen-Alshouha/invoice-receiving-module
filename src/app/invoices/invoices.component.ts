import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../interfaces/invoice.interface';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgbDatepickerModule,
    DatePickerComponent,
  ],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  selectedStatus: number | null = null;
  searchText: string = '';
  searchInvoiceSeq: string = '';
  selectedDate: NgbDateStruct | null = null;
  showInvoiceSeqSearch: boolean = false;
  statuses = [
    { label: 'All', value: null },
    { label: 'Draft', value: 1 },
    { label: 'Created', value: 2 },
  ];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  private loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoices = data;
      this.filteredInvoices = data;
    });
  }

  applyFilter(): void {
    this.filteredInvoices = this.invoices.filter(
      (invoice) =>
        this.matchesText(invoice) &&
        this.matchesStatus(invoice) &&
        this.matchesInvoiceSeq(invoice) &&
        this.matchesSelectedDate(invoice)
    );
  }

  toggleInvoiceSeqSearch(): void {
    this.showInvoiceSeqSearch = !this.showInvoiceSeqSearch;
    this.searchInvoiceSeq = '';
    this.applyFilter();
  }

  onDateSelected(date: NgbDateStruct | null): void {
    this.selectedDate = date;
    this.applyFilter();
  }

  clearDate(): void {
    this.selectedDate = null;
    this.applyFilter();
  }

  private matchesText(invoice: Invoice): boolean {
    if (!this.searchText) return true;
    const search = this.searchText.toLowerCase();
    return (
      String(invoice.invoiceSeq ?? '')
        .toLowerCase()
        .includes(search) ||
      String(invoice.supplierName ?? '')
        .toLowerCase()
        .includes(search) ||
      String(invoice.invoiceNumber ?? '')
        .toLowerCase()
        .includes(search)
    );
  }

  private matchesStatus(invoice: Invoice): boolean {
    return this.selectedStatus !== null
      ? invoice.statusId === this.selectedStatus
      : true;
  }

  private matchesInvoiceSeq(invoice: Invoice): boolean {
    if (!this.searchInvoiceSeq) return true;
    return String(invoice.invoiceSeq ?? '')
      .toLowerCase()
      .includes(this.searchInvoiceSeq.toLowerCase());
  }

  private matchesSelectedDate(invoice: Invoice): boolean {
    if (!this.selectedDate) return true;

    const selectedDateObj = new Date(
      this.selectedDate.year,
      this.selectedDate.month - 1,
      this.selectedDate.day
    );
    const invoiceDateObj = new Date(invoice.invoiceDate);

    return (
      invoiceDateObj.getFullYear() === selectedDateObj.getFullYear() &&
      invoiceDateObj.getMonth() === selectedDateObj.getMonth() &&
      invoiceDateObj.getDate() === selectedDateObj.getDate()
    );
  }
}
