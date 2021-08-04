import { BasketService } from './../../../basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { IBasket } from '../../models/basket';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss'],
})
export class CheckoutReviewComponent implements OnInit {
  basket$: Observable<IBasket> = null!;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }
}
