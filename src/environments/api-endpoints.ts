import { environment } from './environment';

export const API_ENDPOINTS = {
  invoices: `${environment.apiBaseUrl}/invoices`,
  addInvoice: `${environment.apiBaseUrl}/add-invoice`,
  InvoiceItems: `${environment.apiBaseUrl}/invoice-items`,
  searchItems: `${environment.apiBaseUrl}/search-item?itemNo=`,
  addInvoiceItem:`${environment.apiBaseUrl}/add-item`
};