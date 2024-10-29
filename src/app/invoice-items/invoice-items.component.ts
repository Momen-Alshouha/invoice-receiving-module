import { Component, OnInit,Input,viewChild,ElementRef, ViewChild } from '@angular/core';
import { InvoiceItemsService } from '../services/invoice-items.service';
import { InvoiceItem } from '../interfaces/invoice-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdditionalCostComponent } from "../additional-cost/additional-cost.component";
@Component({
  selector: 'app-invoice-items',
  standalone: true,
  imports: [CommonModule, FormsModule, AdditionalCostComponent],
  templateUrl: './invoice-items.component.html',
  styleUrls: ['./invoice-items.component.css']
})
export class InvoiceItemsComponent implements OnInit {

  @Input() invoiceId: number | null = null;

  @Input() invoiceDescription: string = '';
  @Input() totalNetAmount: number = 4054.000; 
  @Input() totalDiscountAmount: number = 5.000;
  @Input() netTotal: number = 4.049000;
  @Input() totalTaxAmount: number = 4.061 ;
  @Input() grandAmount: number = 0.71;
  @Input() exchangeRate: number = 1;
  @Input() grandAmountLocal: number = 2.883310;
  
  invoiceItems: InvoiceItem[] = [];
  searchItemNo: string = '';
  searchResults: InvoiceItem[] = []; 
  selectedItem: InvoiceItem | null = null; 
  quantity: number = 0; 
  private searchTerms = new Subject<string>();
  serialNoInput: string = '';
  serialCodeInput: string = '';
  itemAddedId:number=0;
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
          this.itemAddedId = response.itemId;
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
