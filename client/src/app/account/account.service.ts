import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private currentUserSource = new ReplaySubject<IUser>(null!);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  public async loadCurrentUser(token: string): Promise<IUser> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return await this.http
      .get<IUser>(`${this.baseUrl}/account`, { headers })
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.currentUserSource.next(user);
          }

          return user;
        })
      )
      .toPromise();
  }

  public async login(values: any): Promise<void> {
    return await this.http
      .post<IUser>(`${this.baseUrl}/account/login`, values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem(TOKEN, user.token);
            this.currentUserSource.next(user);
          }
        })
      )
      .toPromise();
  }

  public async register(values: any): Promise<void> {
    return this.http
      .post<IUser>(`${this.baseUrl}/account/register`, values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem(TOKEN, user.token);
          }
        })
      )
      .toPromise();
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
