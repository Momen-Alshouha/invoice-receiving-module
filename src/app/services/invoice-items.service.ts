import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceItem } from '../interfaces/invoice-item';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class InvoiceItemsService {
  private apiUrl = API_ENDPOINTS.InvoiceItems;

  constructor(private http: HttpClient) {}

  getInvoiceItems(): Observable<InvoiceItem[]> {
    return this.http.get<InvoiceItem[]>(this.apiUrl);
  }

  searchItem(itemNo: string): Observable<InvoiceItem[]> {
    return this.http.get<InvoiceItem[]>(`${API_ENDPOINTS.searchItems}${itemNo}`);
  }
  
  addItem(invoiceItem: InvoiceItem): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.addInvoiceItem}`, invoiceItem);
  }

  updateItem(item: InvoiceItem | null): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.addInvoiceItem}`, item);
  }
}
