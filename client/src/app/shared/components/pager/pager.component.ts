import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
   selector: 'app-pager',
   templateUrl: './pager.component.html',
   styleUrls: ['./pager.component.scss'],
})
export class PagerComponent {
   @Input() totalCount: number = 0;
   @Input() pageSize: number = 0;
   @Output() pageChanged = new EventEmitter<number>();

   constructor() {}

   public onPageChanged(event: PageChangedEvent) {
      this.pageChanged.emit(event.page);
   }
}
