import { BasketService } from 'src/app/basket/basket.service';
import { Component, OnInit } from '@angular/core';
@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
   title = 'Skinet';

   constructor(private basketService: BasketService) {}

   async ngOnInit(): Promise<void> {
      const basketId = localStorage.getItem('basket_id');

      if (basketId) {
         this.basketService.getBasket(basketId).subscribe(
            () => {
               console.log('initialized');
            },
            error => {
               console.log(error);
            }
         );
      }
   }
}
