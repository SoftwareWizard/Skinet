import { IUser } from './../../shared/models/user';
import { AccountService } from './../account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = null!;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  private createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  public async onSubmit(): Promise<void> {
    await this.accountService.login(this.loginForm.value);
    this.router.navigateByUrl('shop');
  }
}
