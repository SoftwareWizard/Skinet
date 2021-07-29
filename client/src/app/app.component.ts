import { AccountService } from './account/account.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skinet';

  constructor(private accountService: AccountService) {}

  async ngOnInit(): Promise<void> {
    await this.loadCurrentUser();
  }

  private async loadCurrentUser() {
    const token = localStorage.getItem('token');

    if (token) {
      await this.accountService.loadCurrentUser(token);
    }
  }
}
