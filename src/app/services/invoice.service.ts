import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { Invoice } from '../interfaces/invoice.interface';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = API_ENDPOINTS.invoices;

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  addInvoice(invoiceData: Partial<Invoice>): Observable<Invoice> {
    return this.http.post<Invoice>(API_ENDPOINTS.addInvoice, invoiceData);
  }

  searchUsers(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${API_ENDPOINTS.userSearch}${name}`);
  }

}
