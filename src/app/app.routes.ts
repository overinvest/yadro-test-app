import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserFormComponent } from './components/user-form/user-form.component';

export const routes: Routes = [
  // Перенаправление с корневого маршрута на список пользователей
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  
  // Маршрут для списка пользователей
  { path: 'users', component: UserListComponent },
  
  // Маршрут для создания нового пользователя
  { path: 'users/new', component: UserFormComponent },
  
  // Маршрут для редактирования существующего пользователя
  { path: 'users/edit/:id', component: UserFormComponent },
  
  // Маршрут для просмотра детальной информации о пользователе
  { path: 'users/:id', component: UserDetailsComponent },
  
  // Маршрут для обработки несуществующих URL
  { path: '**', redirectTo: 'users' }
];
