import { BasketService } from 'src/app/basket/basket.service';
import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
   selector: 'app-nav-bar',
   templateUrl: './nav-bar.component.html',
   styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
   basket$: Observable<IBasket> = of(null!);

   constructor(private basketService: BasketService) {}

   ngOnInit(): void {
      this.basket$ = this.basketService.basket$;
   }
}
