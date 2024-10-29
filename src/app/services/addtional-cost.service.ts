import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdditionalCost } from '../interfaces/addtional-cost.interface';
import { API_ENDPOINTS } from '../../environments/api-endpoints';


@Injectable({
  providedIn: 'root'
})
export class AdditionalCostService {
  constructor(private http: HttpClient) {}

  addCost(cost: AdditionalCost): Observable<any> {
    return this.http.post(API_ENDPOINTS.addCost, cost);
  }
}
