import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IBasket, IBasketItem } from '../../models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss'],
})
export class BasketSummaryComponent {
  @Input() basket: IBasket = null!;
  @Input() isReadonly: boolean = false;

  @Output() increment: EventEmitter<IBasketItem> =
    new EventEmitter<IBasketItem>();
  @Output() decrement: EventEmitter<IBasketItem> =
    new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();

  constructor() {}

  public onDecrementQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }

  public onIncrementQuantity(item: IBasketItem) {
    this.increment.emit(item);
  }

  public onRemoveItem(item: IBasketItem) {
    this.remove.emit(item);
  }
}
