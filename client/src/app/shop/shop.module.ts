import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
   declarations: [ShopComponent, ProductItemComponent],
   imports: [CommonModule, BrowserModule, SharedModule],
   exports: [ShopComponent],
})
export class ShopModule {}
