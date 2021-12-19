import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailRoutes } from './verify-email.routing';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VerifyEmailRoutes),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    VerifyEmailComponent],
})
export class VerifyEmailModule { }
