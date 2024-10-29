import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../interfaces/invoice.interface';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../interfaces/user';
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

  //user search
  userSearchText = '';
  selectedUserId: number | null = null;
  userResults: User[] = [];

  constructor(private invoiceService: InvoiceService) {}

  clearUserFilter(): void {
    this.userSearchText = ''; // Clear search input
    this.selectedUserId = null; // Reset selected user ID
    this.userResults = []; // Clear search results
    this.applyFilter(); // Reapply filter to show all invoices
  }

  clearAllFilters(): void {
    this.userSearchText = ''; // Clear user search text
    this.selectedUserId = null; // Clear selected user filter
    this.selectedStatus = null; // Clear selected status filter
    this.selectedDate = null; // Clear selected date filter
    this.searchInvoiceSeq = ''; // Clear invoice sequence filter
    this.userResults = []; // Clear dropdown results
    this.applyFilter(); // Reapply filter to reset view
  }

  onUserSearch(term: string): void {
    if (term.trim()) {
      this.invoiceService.searchUsers(term).subscribe({
        next: (users) => (this.userResults = users),
        error: (err) => console.error('Error fetching users', err),
      });
    } else {
      this.userResults = []; // Clear dropdown if input is empty
    }
  }

  private matchesUser(invoice: Invoice): boolean {
    const userIdToMatch = Number(this.selectedUserId);
    const isMatch = this.selectedUserId
      ? invoice.userId === userIdToMatch
      : true;

    console.log(`Checking user match for invoice ${invoice.invoiceSeq}:`, {
      selectedUserId: this.selectedUserId,
      invoiceUserId: invoice.userId,
      isMatch,
    });

    return isMatch;
  }

  selectUser(user: any): void {
    this.selectedUserId = user.id.toString(); // Set the selected user ID
    this.userSearchText = user.name; // Set input value to the selected name
    this.userResults = []; // Clear the dropdown
    this.applyFilter(); // Apply filter immediately after selection
  }

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
    console.log('Applying filter with selectedUserId:', this.selectedUserId);

    this.filteredInvoices = this.invoices.filter((invoice) => {
      const matchesText = this.matchesText(invoice);
      const matchesStatus = this.matchesStatus(invoice);
      const matchesInvoiceSeq = this.matchesInvoiceSeq(invoice);
      const matchesDate = this.matchesSelectedDate(invoice);
      const matchesUser = this.matchesUser(invoice);

      console.log(`Invoice ID ${invoice.invoiceSeq}:`, {
        matchesText,
        matchesStatus,
        matchesInvoiceSeq,
        matchesDate,
        matchesUser,
      });

      return (
        matchesText &&
        matchesStatus &&
        matchesInvoiceSeq &&
        matchesDate &&
        matchesUser
      );
    });

    console.log('Filtered Invoices:', this.filteredInvoices);
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
