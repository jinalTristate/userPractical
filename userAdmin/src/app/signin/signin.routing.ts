import { Routes } from '@angular/router';
import { SigninComponent } from './signin.component';

export const SigninRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SigninComponent
      }
    ]
  }
];
