import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CookieService } from "ngx-cookie-service";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../app/shared/services/common.service';
import {AuthGuardService} from '../app/shared/services/admin-guard.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService } from './shared/services/loader.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgSelectModule,
    HttpClientModule
  ],
  providers: [
    CommonService, 
    AuthGuardService,
    CookieService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
