import { AccountService } from './../../account/account.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map((auth) => {
        if (auth) {
          return true;
        }

        let url = this.router.parseUrl('account/login');
        url.queryParams = { returnUrl: state.url };

        return url;
      })
    );
  }
}
