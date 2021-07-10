import { ShopParams } from '../shared/models/shopParams';
import { Observable } from 'rxjs';
import { IPagination } from '../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProductBrand } from '../shared/models/product-brand';
import { IProductType } from '../shared/models/product-type';

@Injectable({
   providedIn: 'root',
})
export class ShopService {
   private baseUrl = 'https://localhost:5001/api';

   constructor(private http: HttpClient) {}

   public getProducts(shopParams: ShopParams): Observable<IPagination> {
      let params = new HttpParams();

      if (shopParams.brandId !== 0) {
         params = params.append('brandId', shopParams.brandId.toString());
      }

      if (shopParams.typeId !== 0) {
         params = params.append('typeId', shopParams.typeId.toString());
      }

      params = params.append('sort', shopParams.sort);
      params = params.append('pageIndex', shopParams.pageNumber);
      params = params.append('pageSize', shopParams.pageSize);

      return this.http.get<IPagination>(`${this.baseUrl}/products`, { params });
   }

   public getTypes(): Observable<IProductType[]> {
      return this.http.get<IProductType[]>(`${this.baseUrl}/products/types`);
   }

   public getBrands(): Observable<IProductBrand[]> {
      return this.http.get<IProductBrand[]>(`${this.baseUrl}/products/brands`);
   }
}
