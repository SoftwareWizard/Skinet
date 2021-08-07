import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/models/user';
import { AccountService } from './../../../account/account.service';
import { environment } from './../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from './../../../checkout/checkout.service';
import { BasketService } from 'src/app/basket/basket.service';
import { FormGroup } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { IBasket } from '../../models/basket';
import { IOrderToCreate } from '../../models/order';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup = null!;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef =
    null!;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef =
    null!;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef = null!;

  stripePublicKey = environment.stripePublicKey;
  stripe: stripe.Stripe = null!;
  cardNumber: stripe.elements.Element = null!;
  cardExpiry: stripe.elements.Element = null!;
  cardCvc: stripe.elements.Element = null!;

  cardNumberError: string = null!;
  cardExpiryError: string = null!;
  cardCvcError: string = null!;

  cardNumberHandler: stripe.elements.handler = this.onChange.bind(this);
  cardExpiryHandler: stripe.elements.handler = this.onChange.bind(this);
  cardCvcHandler: stripe.elements.handler = this.onChange.bind(this);
  private user$: Observable<IUser> = null!;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router,
    private accountService: AccountService
  ) {
    this.user$ = this.accountService.currentUser$;
  }

  ngAfterViewInit(): void {
    this.stripe = Stripe(this.stripePublicKey);
    var elements = this.stripe.elements({ locale: 'en' });

    let classes = {
      base: 'stripe-element',
      invalid: 'invalid',
      focus: 'focus',
      empty: 'empty',
      complete: 'complete',
    };

    let options = { classes };

    this.cardNumber = elements.create('cardNumber', {
      ...options,

      showIcon: true,
    });

    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardNumberHandler);

    this.cardExpiry = elements.create('cardExpiry', options);
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardExpiryHandler);

    this.cardCvc = elements.create('cardCvc', options);
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardCvcHandler);
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  private onChange(response?: stripe.elements.ElementChangeResponse) {
    let error = response?.error;
    let elementType = response?.elementType;

    switch (elementType) {
      case 'cardNumber':
        this.cardNumberError = error?.message ? error.message : null!;
        break;
      case 'cardExpiry':
        this.cardExpiryError = error?.message ? error.message : null!;
        break;
      case 'cardCvc':
        this.cardCvcError = error?.message ? error.message : null!;
        break;
      default:
        break;
    }
  }

  async onSubmitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    const nameOnCard = this.checkoutForm
      .get('paymentForm')
      ?.get('nameOnCard')?.value;

    const addressData = this.checkoutForm.get('addressForm')?.value;

    const address = {
      line1: addressData.street,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.zipCode,
    } as stripe.BillingDetailsAddress;

    const paymentData = {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: nameOnCard,
          address,
        },
      },
    } as stripe.ConfirmCardPaymentData;

    try {
      const order = await this.checkoutService.createOrder(orderToCreate);
      this.toastr.success('Order created');

      var response = await this.stripe.confirmCardPayment(
        basket.clientSecret ?? '',
        paymentData
      );

      if (response.paymentIntent) {
        console.log(response.paymentIntent);
        this.basketService.deleteLocalBasket(basket.id);
        const navigationExtras: NavigationExtras = { state: order };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        throw new Error(response.error?.message);
      }
    } catch (error) {
      this.toastr.error(error.message, 'Payment Error');
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
