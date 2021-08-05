import { BasketService } from 'src/app/basket/basket.service';
import { IDeliveryMethod } from './../../models/deliveryMethod';
import { CheckoutService } from './../../../checkout/checkout.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-delivery-method',
  templateUrl: './checkout-delivery-method.component.html',
  styleUrls: ['./checkout-delivery-method.component.scss'],
})
export class CheckoutDeliveryMethodComponent implements OnInit {
  @Input() checkoutForm: FormGroup = null!;
  deliveryMethods: IDeliveryMethod[] = [];

  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.deliveryMethods = await this.checkoutService.getDeliveryMethods();
    console.log(this.deliveryMethods);
  }

  public setShippingPrice(deliveryMethdod: IDeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethdod);
  }
}
