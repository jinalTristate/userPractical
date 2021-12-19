import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './loader.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import * as crypto from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private Url = '';
  private defaultAuthToken = '';
  private key = 'dfgdfgk34mF37y45';
  private language = 'en';

  constructor(
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private http: HttpClient,
    private cookieService: CookieService) {
    this.Url = environment.API_URL,
      this.defaultAuthToken = environment.DEFAULT_AUTH_TOKEN
    this.key = environment.ENCRYPTION_KEY;
  }

  alert(alertFlag, title, message, onClickClose = false) {
    // 0 == Error 
    // 1 == Success 

    if (alertFlag == 1) {
      this.toastr.success(message, title, { timeOut: onClickClose ? 0 : 10000, enableHtml: true, positionClass: 'toast-bottom-right'  });
    }
    else if (alertFlag == 0) {
      this.toastr.error(message, title, { timeOut: onClickClose ? 0 : 10000, enableHtml: true, positionClass: 'toast-bottom-right' });
    }
  }


  encrypt(message) {
		var cipherText = crypto.AES.encrypt(message.toString(), this.key).toString();
		return cipherText;
	}
	decrypt(cipherText) {
		var message = crypto.AES.decrypt(cipherText, this.key).toString(crypto.enc.Utf8);
		return message;
	}

	setCookie(key, value) {
		var cipherValue = this.encrypt(value);
    this.cookieService.set( key, cipherValue, 1 , '/', 'localhost', false, "Lax"  ); 
	}


	getCookie(key): any {
		if (this.checkCookie(key)) {
			var cipherKeyValue = this.cookieService.get(key);
			var plainText = this.decrypt(cipherKeyValue);
      console.log("plain",plainText)
      // plainText = JSON.parse(plainText)
			return plainText;
		} else {
			return;
		}
	}

	checkCookie(key) {
		return this.cookieService.check(key);
	}

	deleteCookie(key) {
		this.cookieService.delete(key, '/','localhost');
	}

	deleteAllCookie() {
		this.cookieService.deleteAll('/ ', 'localhost');   
	}

  getApiCall(methodName) {
    this.loaderService.showLoader();
    var URL = this.Url + methodName;
    let headers = {
      'language': this.language,
      'auth_token': this.getCookie('access_token'),
    };
    let options = { headers: new HttpHeaders(headers) };
    return this.http.get(URL, options)
      .pipe(
        map((response: any) => {
          this.loaderService.hideLoader();
          return response;
        }),
        catchError((err) => {
          console.log(err);
          this.loaderService.hideLoader();
          this.alert('1', 'Error', err.statusText)
          throw (err)
        })
      )
  }

  postApiCall(methodName, requestData) {
    this.loaderService.showLoader();
    var URL = this.Url + methodName;
    let headers = {
      'language': this.language,
      'auth_token': this.defaultAuthToken
    };
    let options = { headers: new HttpHeaders(headers) };
    console.log("url======",URL)
    return this.http.post(URL, requestData, options)
      .pipe(
        map((response: any) => {
          this.loaderService.hideLoader();
          return response;
        }),
        catchError((err) => {
          console.log(err);
          this.loaderService.hideLoader();
          this.alert('1', 'Error', err.statusText)
          throw (err)
        })
      )
  }
  postApiCallWithToken(methodName, requestData) {
    this.loaderService.showLoader();
    var URL = this.Url + methodName;
    let headers = {
      'language': this.language,
      'auth_token': this.getCookie('access_token'),
    };
    console.log("headers",headers)
    let options = { headers: new HttpHeaders(headers) };
    console.log("url======",URL)
    return this.http.post(URL, requestData, options)
      .pipe(
        map((response: any) => {
          this.loaderService.hideLoader();
          return response;
        }),
        catchError((err) => {
          console.log(err);
          this.loaderService.hideLoader();
          this.alert('1', 'Error', err.statusText)
          throw (err)
        })
      )
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}