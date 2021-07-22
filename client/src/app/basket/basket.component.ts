import { IBasket } from './../shared/models/basket';
import { IProduct } from './../shared/models/product';
import { BasketService } from './basket.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
   selector: 'app-basket',
   templateUrl: './basket.component.html',
   styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
   public basket: IBasket = {} as IBasket;

   constructor(private basketService: BasketService) {}

   async ngOnInit(): Promise<void> {
      const basketId = localStorage.getItem('basket_id');

      if (basketId) {
         this.basket = await this.basketService.getBasket(basketId!);
      }
   }
}
