import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvoicesComponent } from "./invoices/invoices.component";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AddInvoiceComponent,FormsModule,RouterOutlet, InvoicesComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoice-receiving-module';
}
