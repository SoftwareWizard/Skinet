import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import {
  CarouselComponent,
  CarouselModule,
  SlideComponent,
} from 'ngx-bootstrap/carousel';
import { OrderTotalComponent } from './components/order-total/order-total.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [PagingHeaderComponent, PagerComponent, OrderTotalComponent],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    ReactiveFormsModule,
  ],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    CarouselComponent,
    SlideComponent,
    OrderTotalComponent,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
