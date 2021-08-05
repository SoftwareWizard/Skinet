import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../../account/account.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss'],
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup = null!;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  public async saveUserAddress() {
    try {
      let address = this.checkoutForm.get('addressForm')?.value;
      await this.accountService.updateUserAddress(address);
      this.toastr.success('Address saved');
    } catch (error) {
      this.toastr.error(error.message);
    }
  }

  public get isSaveable(): boolean {
    return (
      !this.checkoutForm.get('addressForm')?.valid ||
      !this.checkoutForm.get('addressForm')?.dirty
    );
  }
}
