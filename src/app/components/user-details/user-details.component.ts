import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzIconModule,
    NzMessageModule,
    NzSpinModule
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  userId!: number;
  user: User | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    // Получаем ID пользователя из параметров маршрута
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.fetchUserDetails();
      }
    });
  }

  fetchUserDetails(): void {
    this.loading = true;
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        this.message.error('Не удалось загрузить информацию о пользователе');
        console.error('Ошибка при загрузке данных пользователя:', error);
        this.loading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  goToEditUser(): void {
    this.router.navigate(['/users/edit', this.userId]);
  }

  deleteUser(): void {
    if (this.userId) {
      this.userService.deleteUser(this.userId).subscribe({
        next: () => {
          this.message.success('Пользователь успешно удален');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.message.error('Не удалось удалить пользователя');
          console.error('Ошибка при удалении пользователя:', error);
        }
      });
    }
  }
}
