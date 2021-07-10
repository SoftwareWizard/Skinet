import { Component, Input, OnInit } from '@angular/core';

@Component({
   selector: 'app-paging-header',
   templateUrl: './paging-header.component.html',
   styleUrls: ['./paging-header.component.scss'],
})
export class PagingHeaderComponent implements OnInit {
   @Input() totalCount: number = 0;
   @Input() pageSize: number = 0;
   @Input() pageNumber: number = 0;

   constructor() {}

   ngOnInit(): void {}

   public get firstIndex(): number {
      return (this.pageNumber - 1) * this.pageSize + 1;
   }

   public get lastIndex(): number {
      return this.pageNumber * this.pageSize > this.totalCount
         ? this.totalCount
         : this.pageNumber * this.pageSize;
   }

   public get hasItems(): boolean {
      return this.totalCount > 0;
   }
}
