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
   public basket$ = new Observable<IBasket>();

   constructor(private basketService: BasketService) {}

   async ngOnInit(): Promise<void> {
      this.basket$ = this.basketService.basket$;
   }

   public async onIncrementQuantity(item: IBasketItem) {
      await this.basketService.incrementItemQuantity(item);
   }

   public async onDecrementQuantity(item: IBasketItem) {
      await this.basketService.decrementItemQuantity(item);
   }

   public async onRemoveItem(item: IBasketItem) {
      await this.basketService.removeItem(item);
   }

   public async onClearBasket() {
      await this.basketService.clearBasket();
   }
}
