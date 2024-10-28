import { Component, OnInit,Input } from '@angular/core';
import { InvoiceItemsService } from '../services/invoice-items.service';
import { InvoiceItem } from '../interfaces/invoice-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-invoice-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-items.component.html',
  styleUrls: ['./invoice-items.component.css']
})
export class InvoiceItemsComponent implements OnInit {
  @Input() invoiceId: number | null = null;

  @Input() invoiceDescription: string = '';
  @Input() totalNetAmount: number = 0; 
  @Input() totalDiscountAmount: number = 0;
  @Input() netTotal: number = 0;
  @Input() totalTaxAmount: number = 0;
  @Input() grandAmount: number = 0;
  @Input() exchangeRate: number = 1;
  @Input() grandAmountLocal: number = 0;
  
  invoiceItems: InvoiceItem[] = [];
  searchItemNo: string = '';
  searchResults: InvoiceItem[] = []; 
  selectedItem: InvoiceItem | null = null; 
  quantity: number = 0; 
  private searchTerms = new Subject<string>();
  serialNoInput: string = '';
  serialCodeInput: string = '';

  constructor(private invoiceItemsService: InvoiceItemsService,private modalService: NgbModal) {}
  
  ngOnInit(): void {}
  
  onSearch(term: string): void {
    this.searchTerms.next(term); 
    this.searchTerms.pipe(
      distinctUntilChanged(), 
      switchMap((term: string) => this.invoiceItemsService.searchItem(term))
    ).subscribe({
      next: (data: InvoiceItem[]) => {
        this.searchResults = data;
        console.log("searchResults updated LENGTH:", this.searchResults.length);
      },
      error: (err) =>{ console.error('Error fetching items:', err) ; this.searchResults.length =0}
      
    });
  }

  addItem() {
    if (this.selectedItem && this.quantity > 0 && this.invoiceId !== null) {
      const itemToAdd: InvoiceItem = {
        ...this.selectedItem,
        invoiceId: this.invoiceId,
        quantity: this.quantity,
      };

      this.invoiceItemsService.addItem(itemToAdd).subscribe({
        next: (response) => {
          console.log('Item added successfully:', response);
          this.invoiceItems.push(itemToAdd);
          this.resetSearch();
        },
        error: (err) => console.error('Error adding item:', err),
      });

      this.resetSearch(); 
    }
  }

  selectItem(item: InvoiceItem) {
    this.selectedItem = item;
    this.searchItemNo = item.itemNo;
    this.searchResults = []; 
  }

  resetSearch() {
    this.searchItemNo = '';
    this.searchResults = [];
    this.selectedItem = null;
    this.quantity = 1;
  }

   openSerialModal(item: InvoiceItem, content: any) {
    this.selectedItem = item;
    this.serialNoInput = item.serialNo || ''; 
    this.serialCodeInput = item.serialCode || '';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // to save serialNo and serialCode if they don’t exist
  saveSerial() {
    if (this.selectedItem) {
      this.selectedItem.serialNo = this.selectedItem.serialNo || this.serialCodeInput;
      this.selectedItem.serialCode = this.serialCodeInput;
      this.modalService.dismissAll();
    }

     this.invoiceItemsService.updateItem(this.selectedItem).subscribe({
      next: (response) => {
        console.log('Item updated successfully', response);
        this.modalService.dismissAll(); 
      },
      error: (err) => console.error('Error updating item', err)
    });
  }
}
