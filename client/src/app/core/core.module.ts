import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TestErrorComponent } from './test-error/test-error.component';

@NgModule({
   declarations: [NavBarComponent, TestErrorComponent],
   imports: [CommonModule, RouterModule],
   exports: [NavBarComponent],
})
export class CoreModule {}
