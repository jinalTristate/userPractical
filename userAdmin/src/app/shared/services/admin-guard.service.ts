import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, ActivatedRoute, Params } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { CommonService } from "./common.service";

@Injectable()
export class AuthGuardService implements CanActivate,CanActivateChild {
    constructor(private cookieService: CookieService,
                private router: Router,
                private commonService: CommonService,
    ) { }
    
   
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        let user = this.commonService.checkCookie('access_token')
        let userValue = this.commonService.getCookie('access_token');
        let path;
        if ( user == false || userValue == '' || userValue == 'undefined') {
            path = '/signin';
            this.cookieService.deleteAll();
            this.router.navigate ( [ path ] );
        }
        return this.cookieService.check('access_token');
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute,state);
    }
}