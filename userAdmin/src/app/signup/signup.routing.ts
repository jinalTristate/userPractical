import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';

export const SignupRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SignupComponent
      }
    ]
  }
];
