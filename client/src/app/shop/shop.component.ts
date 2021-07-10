import { IProductBrand } from './../models/product-brand';
import { ShopService } from './shop.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../models/product';
import { IProductType } from '../models/product-type';

@Component({
   selector: 'app-shop',
   templateUrl: './shop.component.html',
   styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
   public products: IProduct[] = [];
   public types: IProductType[] = [];
   public brands: IProductBrand[] = [];

   public selectedBrandId: number = 0;
   public selectedTypeId: number = 0;

   public selectedSort = 'name';
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
      let pagination = await this.shopService
         .getProducts(this.selectedBrandId, this.selectedTypeId, this.selectedSort)
         .toPromise();
      this.products = pagination.data;
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
      this.selectedBrandId = id;
      await this.getProducts();
   }

   async onTypeSelected(id: number): Promise<void> {
      this.selectedTypeId = id;
      await this.getProducts();
   }

   async onSortSelected(sort: string) {
      this.selectedSort = sort;
      await this.getProducts();
   }
}
