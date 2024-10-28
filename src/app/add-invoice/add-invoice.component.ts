import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../services/invoice.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceItemsComponent } from "../invoice-items/invoice-items.component";

CommonModule;
@Component({
  selector: 'app-add-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InvoiceItemsComponent],
  templateUrl: './add-invoice.component.html',
  styleUrl: './add-invoice.component.css',
})
export class AddInvoiceComponent {
  invoiceForm: FormGroup;
  shipments = ['SPX1122232', 'SPX2233445', 'SPX3344556'];
  selectedShipments: string[] = [];
  invoiceId: number | null = null; 
  createdInvoiceData: any = null; 
  formSubmitted = false; 

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: [],
      invoiceSeq: ["invoiceSeq"],
      supplierName: [],
      invoiceDate: [],
      currencyId: [],
      exchangeRate: [],
      userId: [2],
      statusId:[1],
      paymentWayId:[0],
      amount:[0],
      totalAmountJOD:[0]
    });
  }

  addShipment(event: Event) {
    const target = event.target as HTMLSelectElement | null;

    if (target && target.value) {
      const shipment = target.value;
      if (shipment && !this.selectedShipments.includes(shipment)) {
        this.selectedShipments.push(shipment);
        this.invoiceForm.patchValue({ shipmentNos: this.selectedShipments });
      }
      target.value = ''; 
    }
  }

  removeShipment(shipment: string) {
    this.selectedShipments = this.selectedShipments.filter(
      (s) => s !== shipment
    );
    this.invoiceForm.patchValue({ shipmentNos: this.selectedShipments });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      
      const formData = {
        ...this.invoiceForm.value,
        currencyId: Number(this.invoiceForm.value.currencyId),
      };

      this.invoiceService.addInvoice(formData).subscribe({
        next: (response: any) => {
          console.log('Invoice added successfully', response);
          this.invoiceId = response.invoiceId;
          this.createdInvoiceData = {
            ...this.invoiceForm.value,
            status: 1,
          };
          this.formSubmitted = true;
        },
        error: (err) => console.error('Error adding invoice', err),
      });
    }
  }
}
