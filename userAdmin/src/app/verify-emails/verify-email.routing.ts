import { Routes } from '@angular/router';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

export const VerifyEmailRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: VerifyEmailComponent
      }
    ]
  }
];
