import { ShopParams } from '../shared/models/shopParams';
import { IProductBrand } from '../shared/models/product-brand';
import { ShopService } from './shop.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/product-type';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
   selector: 'app-shop',
   templateUrl: './shop.component.html',
   styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
   public products: IProduct[] = [];
   public types: IProductType[] = [];
   public brands: IProductBrand[] = [];

   public shopParams = new ShopParams();
   public totalCount: number = 0;

   public sortOptions = [
      { name: 'Alphabetical', value: 'name' },
      { name: 'Price: Low to High', value: 'priceAsc' },
      { name: 'Price: High to Low', value: 'priceDesc' },
   ];

   constructor(private shopService: ShopService) {}

   async ngOnInit(): Promise<void> {
      await this.getProducts();
      await this.getBrands();
      await this.getTypes();
   }

   private async getProducts(): Promise<void> {
      let pagination = await this.shopService.getProducts(this.shopParams).toPromise();
      this.products = pagination.data;
      this.totalCount = pagination.count;
   }

   private async getTypes(): Promise<void> {
      this.types = await this.shopService.getTypes().toPromise();
      this.types = [{ id: 0, name: 'All' }, ...this.types];
   }

   private async getBrands(): Promise<void> {
      this.brands = await this.shopService.getBrands().toPromise();
      this.brands = [{ id: 0, name: 'All' }, ...this.brands];
   }

   async onBrandSelected(id: number): Promise<void> {
      this.shopParams.brandId = id;
      await this.getProducts();
   }

   async onTypeSelected(id: number): Promise<void> {
      this.shopParams.typeId = id;
      await this.getProducts();
   }

   async onSortSelected(sort: string) {
      this.shopParams.sort = sort;
      await this.getProducts();
   }

   async onPageChanged(pageNumber: number) {
     this.shopParams.pageNumber = pageNumber;
     await this.getProducts();
   }
  }
