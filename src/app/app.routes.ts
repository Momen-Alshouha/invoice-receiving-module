import { Routes } from '@angular/router';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { InvoicesComponent } from './invoices/invoices.component';

export const routes: Routes = [
    { path: 'add-invoice', component: AddInvoiceComponent },
    { path: 'invoices', component: InvoicesComponent },
    { path: '', redirectTo: '/invoices', pathMatch: 'full' },
];
