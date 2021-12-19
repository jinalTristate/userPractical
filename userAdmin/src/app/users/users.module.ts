import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UsersRoutes} from './users.routing';
import { UserProfileComponent } from './user-profile/user-profile.component'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    UserProfileComponent,
    EditUserProfileComponent],
})
export class UsersModule { }
