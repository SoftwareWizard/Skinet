import { IDeliveryMethod } from './../shared/models/deliveryMethod';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Basket,
  IBasket,
  IBasketItem,
  IBasketTotal,
} from '../shared/models/basket';
import { map } from 'rxjs/operators';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null!);
  private basketTotalSource = new BehaviorSubject<IBasketTotal>(null!);
  private shipping = 0;

  public basket$ = this.basketSource.asObservable();
  public basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) {}

  public async createPaymentIntent(): Promise<IBasket> {
    let basket = this.getCurrentBasketValue();
    const basketId = basket.id;
    basket = await this.http
      .post<IBasket>(`${this.baseUrl}/payments/${basketId}`, {})
      .toPromise();

    this.basketSource.next(basket);
    return basket;
  }

  public setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    this.calculateTotal();
    this.setBasket(basket);
  }

  public async getBasket(id: string): Promise<IBasket> {
    return await this.http
      .get<IBasket>(`${this.baseUrl}/basket/${id}`)
      .pipe(
        map((item) => {
          this.basketSource.next(item);
          this.calculateTotal();
          return item;
        })
      )
      .toPromise();
  }

  private async setBasket(basket: IBasket): Promise<IBasket> {
    return await this.http
      .post<IBasket>(`${this.baseUrl}/basket`, basket)
      .pipe(
        map((item) => {
          this.basketSource.next(item);
          this.calculateTotal();
          return item;
        })
      )
      .toPromise();
  }

  private async deleteBasket(id: string): Promise<boolean> {
    return await this.http
      .delete<boolean>(`${this.baseUrl}/basket/${id}`)
      .pipe(
        map((item) => {
          this.basketSource.next(null as any);
          this.calculateTotal();
          return item;
        })
      )
      .toPromise();
  }

  public async incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundIndex = basket.items.findIndex((x) => x.id === item.id);
    basket.items[foundIndex].quantity++;
    await this.setBasket(basket);
  }

  public async decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundIndex = basket.items.findIndex((x) => x.id === item.id);
    basket.items[foundIndex].quantity--;

    if (basket.items[foundIndex].quantity === 0) {
      basket.items.splice(foundIndex, 1);
    }

    await this.setBasket(basket);
  }

  public async removeItem(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundIndex = basket.items.findIndex((x) => x.id === item.id);
    basket.items.splice(foundIndex, 1);
    await this.setBasket(basket);
  }

  public async clearBasket() {
    const basket = this.getCurrentBasketValue();
    localStorage.removeItem('basket_id');
    await this.deleteBasket(basket.id);
  }

  public async addItemToBasket(item: IProduct, quantity = 1): Promise<void> {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      item,
      quantity
    );
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    await this.setBasket(basket);
  }

  public deleteLocalBasket(basketId: string) {
    this.basketSource.next(null!);
    this.basketTotalSource.next(null!);
    localStorage.removeItem('basket_id');
  }

  public getCurrentBasketValue() {
    return this.basketSource.value;
  }

  private addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = items.findIndex((i) => i.id === itemToAdd.id);

    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  private calculateTotal() {
    const basket = this.getCurrentBasketValue();

    if (basket) {
      const shipping = this.shipping;
      const subtotal = basket.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const total = subtotal + shipping;
      this.basketTotalSource.next({ shipping, subtotal, total });
    }
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(
    item: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    };
  }
}
