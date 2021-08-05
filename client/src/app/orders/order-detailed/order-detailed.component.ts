import { OrdersService } from './../orders.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/models/order';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss'],
})
export class OrderDetailedComponent implements OnInit {
  order: IOrder = null!;
  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private ordersService: OrdersService
  ) {
    this.breadcrumbService.set('@OrderDetailed', '');
  }

  async ngOnInit(): Promise<void> {
    try {
      const orderId = +(this.route.snapshot.paramMap.get('id') ?? 0);
      this.order = await this.ordersService.getOrderDetailed(orderId);
      this.breadcrumbService.set(
        '@OrderDetailed',
        `Order# ${this.order.id} - ${this.order.status}`
      );
    } catch (error) {
      console.log(error);
    }
  }
}
