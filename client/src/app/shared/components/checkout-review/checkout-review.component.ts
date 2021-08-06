import { BasketService } from './../../../basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { IBasket } from '../../models/basket';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss'],
})
export class CheckoutReviewComponent implements OnInit {
  basket$: Observable<IBasket> = null!;

  constructor(
    private basketService: BasketService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  public async onCreatePaymentIntent() {
    try {
      await this.basketService.createPaymentIntent();
      this.toastrService.info('Payment intent created');
    } catch (error) {
      console.log(error);
      this.toastrService.error(error.message);
    }
  }
}
