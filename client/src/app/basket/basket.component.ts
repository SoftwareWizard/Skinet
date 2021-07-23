import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from './../shared/models/basket';
import { BasketService } from './basket.service';
import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-basket',
   templateUrl: './basket.component.html',
   styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
   public basket: IBasket = {} as IBasket;
   public basket$ = new Observable<IBasket>();

   constructor(private basketService: BasketService) {}

   async ngOnInit(): Promise<void> {
      this.basket$ = this.basketService.basket$;
   }

   public async incrementQuantity(item: IBasketItem) {
      await this.basketService.incrementItemQuantity(item);
   }

   public async decrementQuantity(item: IBasketItem) {
      await this.basketService.decrementItemQuantity(item);
   }

   public async removeItem(item: IBasketItem) {
      await this.basketService.removeItem(item);
   }

   public async clearBasket() {
      await this.basketService.clearBasket();
   }
}
