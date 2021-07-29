import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { IUser } from '../shared/models/user';
import { map } from 'rxjs/operators';

const TOKEN = 'token';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser>(null!);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  public login(values: any) {
    return this.http.post<IUser>(`${this.baseUrl}/account/login`, values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem(TOKEN, user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  public register(values: any) {
    return this.http
      .post<IUser>(`${this.baseUrl}/account/register`, values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem(TOKEN, user.token);
          }
        })
      );
  }

  public logout() {
    localStorage.removeItem(TOKEN);
    this.currentUserSource.next(null!);
    this.router.navigateByUrl('/');
  }

  public async checkEmailExists(email: string): Promise<boolean> {
    return await this.http
      .get<boolean>(`${this.baseUrl}/account/emailexists?email=${email}`)
      .toPromise();
  }
}
