import { OrdersService } from './../orders.service';
import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(private ordersService: OrdersService) {}

  async ngOnInit(): Promise<void> {
    await this.getOrders();
  }

  private async getOrders() {
    try {
      this.orders = await this.ordersService.getOrdersForUser();
    } catch (error) {
      console.log(error);
    }
  }
}
