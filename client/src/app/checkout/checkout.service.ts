import { IOrder, IOrderToCreate } from './../shared/models/order';
import { IDeliveryMethod } from './../shared/models/deliveryMethod';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async createOrder(order: IOrderToCreate): Promise<IOrder> {
    return await this.http
      .post<IOrder>(`${this.baseUrl}/orders`, order)
      .toPromise();
  }

  public async getDeliveryMethods(): Promise<IDeliveryMethod[]> {
    var deliveryMethods = await this.http
      .get<IDeliveryMethod[]>(`${this.baseUrl}/orders/deliveryMethods`)
      .toPromise();

    return deliveryMethods.sort((a, b) => b.price - a.price);
  }
}
