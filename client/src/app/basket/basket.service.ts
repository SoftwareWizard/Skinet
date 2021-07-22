import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Basket, IBasket, IBasketItem } from '../shared/models/basket';
import { map } from 'rxjs/operators';
import { IProduct } from '../shared/models/product';

@Injectable({
   providedIn: 'root',
})
export class BasketService {
   baseUrl = environment.apiUrl;
   private basketSource = new BehaviorSubject<IBasket>(null as any);
   public basket$ = this.basketSource.asObservable();

   constructor(private http: HttpClient) {}

   public getBasket(id: string) {
      return this.http.get<IBasket>(`${this.baseUrl}/basket/${id}`).pipe(
         map((basket: IBasket) => {
            this.basketSource.next(basket);
         })
      );
   }

   public setBasket(basket: IBasket) {
      return this.http.post<IBasket>(`${this.baseUrl}/basket`, basket).pipe(
         map((basket: IBasket) => {
            this.basketSource.next(basket);
         })
      );
   }

   public deleteBasket(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.baseUrl}/basket/${id}`);
   }

   public getCurrentBasketValue() {
      return this.basketSource.value;
   }

   public addItemToBasket(item: IProduct, quantity = 1) {
      const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
      const basket = this.getCurrentBasketValue() ?? this.createBasekt();
      basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
      this.setBasket(basket);
   }

   private addOrUpdateItem(
      items: IBasketItem[],
      itemToAdd: IBasketItem,
      quantity: number
   ): IBasketItem[] {
      console.log(items);
      const index = items.findIndex(i => i.id === itemToAdd.id);

      if (index === -1) {
         itemToAdd.quantity = quantity;
         items.push(itemToAdd);
      } else {
         items[index].quantity += quantity;
      }

      return items;
   }

   private createBasekt(): IBasket {
      const basket = new Basket();
      localStorage.setItem('basket_id', basket.id);
      return basket;
   }

   private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
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
