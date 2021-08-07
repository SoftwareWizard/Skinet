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

const STRIPE_ELEMENT_CLASSES = {
  base: 'stripe-element',
  invalid: 'invalid',
  focus: 'focus',
  empty: 'empty',
  complete: 'complete',
};
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

  public cardNumber: stripe.elements.Element = null!;
  public cardExpiry: stripe.elements.Element = null!;
  public cardCvc: stripe.elements.Element = null!;

  public cardNumberError: string = null!;
  public cardExpiryError: string = null!;
  public cardCvcError: string = null!;

  private cardNumberComplete? = false;
  private cardExpiryComplete? = false;
  private cardCvcComplete? = false;

  public isLoading = false;

  private cardNumberHandler: stripe.elements.handler = this.onChange.bind(this);
  private cardExpiryHandler: stripe.elements.handler = this.onChange.bind(this);
  private cardCvcHandler: stripe.elements.handler = this.onChange.bind(this);

  private stripe: stripe.Stripe = null!;
  private stripePublicKey = environment.stripePublicKey;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.stripe = Stripe(this.stripePublicKey);
    var elements = this.stripe.elements({ locale: 'en' });
    let options = { classes: STRIPE_ELEMENT_CLASSES };

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
        this.cardNumberComplete = response?.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryError = error?.message ? error.message : null!;
        this.cardExpiryComplete = response?.complete;
        break;
      case 'cardCvc':
        this.cardCvcError = error?.message ? error.message : null!;
        this.cardCvcComplete = response?.complete;
        break;
      default:
        break;
    }
  }

  async onSubmitOrder() {
    this.isLoading = true;
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    const paymentData = this.createPaymentData(basket);

    try {
      const order = await this.checkoutService.createOrder(orderToCreate);
      var paymentResult = await this.stripe.confirmCardPayment(
        basket.clientSecret ?? '',
        paymentData
      );

      if (paymentResult.paymentIntent) {
        this.basketService.deleteLocalBasket(basket.id);
        const navigationExtras: NavigationExtras = { state: order };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        throw new Error(paymentResult.error?.message);
      }
    } catch (error) {
      this.toastr.error(error.message, 'Payment Error');
    } finally {
      this.isLoading = false;
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

  private createPaymentData(basket: IBasket): stripe.ConfirmCardPaymentData {
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

    return {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: nameOnCard,
          address,
        },
      },
    } as stripe.ConfirmCardPaymentData;
  }

  public get isComplete(): boolean {
    const paymentFormComplete = !(this.checkoutForm?.get('paymentForm')?.invalid ?? true);
    return paymentFormComplete &&
      (this.cardNumberComplete ?? false) &&
      (this.cardExpiryComplete ?? false) &&
      (this.cardCvcComplete ?? false);
  }
}
