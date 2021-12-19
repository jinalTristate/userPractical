import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component'
import { AuthGuardService } from '../shared/services/admin-guard.service'
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
export const UsersRoutes: Routes = [
  {
    path: '',
    canActivate:[AuthGuardService],
    children: [
      {
        path: '',
        component: UserProfileComponent
      },
      {
        path: 'edit',
        component: EditUserProfileComponent
      }
    ]
  }
];
