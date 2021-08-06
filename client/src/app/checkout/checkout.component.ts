import { BasketService } from 'src/app/basket/basket.service';
import { AccountService } from './../account/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup = null!;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private basketService: BasketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.createCheckoutFrom();
    await this.getAddressFormValues();
    this.getDeliveryMethodValue();
  }

  createCheckoutFrom() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipCode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required],
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required],
      }),
    });
  }

  public isComplete(formName: string): boolean {
    let value = this.checkoutForm.get(formName)?.valid ?? false;
    return value;
  }

  async getAddressFormValues() {
    let address = await this.accountService.getUserAddress();

    if (address) {
      this.checkoutForm.get('addressForm')?.patchValue(address);
    }
  }

  getDeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();

    if (basket.deliveryMethodId !== null) {
      const deliveryMethodId = basket.deliveryMethodId?.toString();
      this.checkoutForm
        .get('deliveryForm')
        ?.get('deliveryMethod')
        ?.patchValue(deliveryMethodId);
    }
  }
}
