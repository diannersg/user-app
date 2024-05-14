import { Routes } from '@angular/router';
import {userGuard} from "./services/guard/user.guard";

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import(`./login/login.component`).then(m => m.LoginComponent),
  },
  {
    path: 'users',
    loadComponent: () => import(`./user/user-list/user-list.component`).then(m => m.UserListComponent),
    canActivate: [userGuard]
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./user/user-details/user-details.component').then(m => m.UserDetailsComponent),
    canActivate: [userGuard]
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];
