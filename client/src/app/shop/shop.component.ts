import { ShopService } from './shop.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../models/product';

@Component({
   selector: 'app-shop',
   templateUrl: './shop.component.html',
   styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
   public products : IProduct[] = [];

   constructor(private shopService: ShopService) {}

   async ngOnInit(): Promise<void> {
      var pagination = await this.shopService.getProducts().toPromise();
      this.products = pagination.data;
   }
}
