import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public async getOrdersForUser(): Promise<IOrder[]> {
    return await this.http.get<IOrder[]>(`${this.baseUrl}/orders`).toPromise();
  }

  public async getOrderDetailed(id: number): Promise<IOrder> {
    return await this.http
      .get<IOrder>(`${this.baseUrl}/orders/${id}`)
      .toPromise();
  }
}
