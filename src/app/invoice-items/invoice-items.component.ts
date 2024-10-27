import { Component, OnInit } from '@angular/core';
import { InvoiceItemsService } from '../services/invoice-items.service';
import { InvoiceItem } from '../interfaces/invoice-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-invoice-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-items.component.html',
  styleUrls: ['./invoice-items.component.css']
})
export class InvoiceItemsComponent implements OnInit {
  invoiceItems: InvoiceItem[] = []; // Array to store added invoice items
  searchItemNo: string = ''; // For the search input
  searchResults: InvoiceItem[] = []; // Array to store search results
  selectedItem: InvoiceItem | null = null; // Store the selected item
  quantity: number = 0; // Default quantity input
  private searchTerms = new Subject<string>(); // Observable for search terms

  constructor(private invoiceItemsService: InvoiceItemsService) {}

  ngOnInit(): void {}
  
  // Push a search term into the observable stream.
  onSearch(term: string): void {
    this.searchTerms.next(term); 
    this.searchTerms.pipe(
      distinctUntilChanged(), // Only if the term has changed
      switchMap((term: string) => this.invoiceItemsService.searchItem(term))
    ).subscribe({
      next: (data: InvoiceItem[]) => {
        this.searchResults = data;
        console.log("searchResults updated LENGTH:", this.searchResults.length); // Log the updated searchResults
      },
      error: (err) =>{ console.error('Error fetching items:', err) ; this.searchResults.length =0}
      
    });
  }

  // Method to add the selected item to the invoice items table
  addItem() {
    if (this.selectedItem && this.quantity > 0) {
      const itemToAdd: InvoiceItem = {
        ...this.selectedItem,
        quantity: this.quantity
      };

      this.invoiceItems.push(itemToAdd); // Add item to the table
      this.resetSearch(); // Clear selection and search fields
    }
  }

  // Method to handle item selection
  selectItem(item: InvoiceItem) {
    this.selectedItem = item;
    this.searchItemNo = item.itemNo; // Set the input to the selected itemNo
    this.searchResults = []; // Clear search results
  }

  // Reset search fields
  resetSearch() {
    this.searchItemNo = '';
    this.searchResults = [];
    this.selectedItem = null;
    this.quantity = 1;
  }
}
