import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from './../../../checkout/checkout.service';
import { BasketService } from 'src/app/basket/basket.service';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { IBasket } from '../../models/basket';
import { IOrderToCreate } from '../../models/order';
import { IDeliveryMethod } from '../../models/deliveryMethod';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup = null!;
  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onSubmitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);

    try {
      const order = await this.checkoutService.createOrder(orderToCreate);
      this.toastr.success('Order created');
      this.basketService.deleteLocalBasket(basket.id);
      console.log(order);
      const navigationExtras: NavigationExtras = { state: order };
      this.router.navigate(['checkout/success'], navigationExtras);
    } catch (error) {
      this.toastr.error(error.message);
    }
  }

  private getOrderToCreate(basket: IBasket): IOrderToCreate {
    let basketId = basket.id;
    let deliveryMethodId =
      +this.checkoutForm.get('deliveryForm')?.value.deliveryMethod;
    let shipToAddress = this.checkoutForm.get('addressForm')?.value;

    return {
      basketId,
      deliveryMethodId,
      shipToAddress,
    };
  }
}
