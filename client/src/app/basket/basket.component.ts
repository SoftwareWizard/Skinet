import { IProduct } from './../shared/models/product';
import { BasketService } from './basket.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
   selector: 'app-basket',
   templateUrl: './basket.component.html',
   styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
   ngOnInit(): void {}
}
