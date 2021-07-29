import { AccountService } from './../account.service';
import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = null!;
  errors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
        ],
      ],
      password: [null, Validators.required],
    });
  }

  async onSubmit() {
    try {
      await this.accountService.register(this.registerForm.value);
    } catch (error) {
      console.log(error);
      this.errors = error.errors;
    }

    this.router.navigateByUrl('/shop');
  }
}
