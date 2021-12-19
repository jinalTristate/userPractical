import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './signin.component';
import { SigninRoutes } from './signin.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SigninRoutes),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SigninComponent
  ],
})
export class SigninModule { }
