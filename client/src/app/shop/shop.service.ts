import { Observable } from 'rxjs';
import { IPagination } from './../models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProductBrand } from '../models/product-brand';
import { IProductType } from '../models/product-type';

@Injectable({
   providedIn: 'root',
})
export class ShopService {
   private baseUrl = 'https://localhost:5001/api';

   constructor(private http: HttpClient) {}

   public getProducts(brandId?: number, typeId?: number): Observable<IPagination> {
      let params = new HttpParams();

      params = params.append('pageSize', 50);

      if (brandId) {
         params = params.append('brandId', brandId.toString());
      }

      if (typeId) {
         params = params.append('typeId', typeId.toString());
      }

      return this.http.get<IPagination>(`${this.baseUrl}/products`, { params });
   }

   public getTypes(): Observable<IProductType[]> {
      return this.http.get<IProductType[]>(`${this.baseUrl}/products/types`);
   }

   public getBrands(): Observable<IProductBrand[]> {
      return this.http.get<IProductBrand[]>(`${this.baseUrl}/products/brands`);
   }
}
