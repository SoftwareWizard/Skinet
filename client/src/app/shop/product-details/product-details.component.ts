import { IProduct } from './../../shared/models/product';
import { ShopService } from './../shop.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
@Component({
   selector: 'app-product-details',
   templateUrl: './product-details.component.html',
   styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
   public product: IProduct = {} as IProduct;
   private productId: number = 0;

   constructor(
      private shopService: ShopService,
      private activatedRoute: ActivatedRoute,
      private breadcrumbService: BreadcrumbService
   ) {}

   async ngOnInit(): Promise<void> {
      var productIdAsString = this.activatedRoute.snapshot.paramMap.get('id');
      if (productIdAsString) {
         this.productId = +productIdAsString;
      }
      await this.loadProduct();
   }

   private async loadProduct() {
      this.product = await this.shopService.getProduct(this.productId).toPromise();
      this.breadcrumbService.set('@productDetails', this.product.name)
   }
}
