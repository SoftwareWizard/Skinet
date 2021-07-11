import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { BrowserModule } from '@angular/platform-browser';
import { ProductDetailsComponent } from './product-details/product-details.component';

@NgModule({
   declarations: [ShopComponent, ProductItemComponent, ProductDetailsComponent],
   imports: [CommonModule, BrowserModule, SharedModule],
   exports: [ShopComponent],
})
export class ShopModule {}
