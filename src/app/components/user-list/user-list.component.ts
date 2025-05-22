import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzMessageModule,
    NzIconModule,
    NzInputModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchValue = '';
  pageSize = 10;

  constructor(
    private userService: UserService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    console.log('UserListComponent: ngOnInit');
    this.fetchUsers();
  }

  ngAfterViewInit(): void {
    console.log('UserListComponent: ngAfterViewInit');
    // Перезагрузим компонент через небольшую задержку, если список пуст
    setTimeout(() => {
      if (this.users.length === 0) {
        console.log('Повторная загрузка пользователей');
        this.fetchUsers();
      }
    }, 500);
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Получено пользователей:', users.length);
        this.users = users;
        this.filteredUsers = [...users];
        this.loading = false;
      },
      error: (error) => {
        this.message.error('Не удалось загрузить список пользователей');
        console.error('Ошибка при загрузке пользователей:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchValue.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchValueLower = this.searchValue.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(searchValueLower) || 
      user.email.toLowerCase().includes(searchValueLower)
    );
  }

  pageSizeChange(size: number): void {
    this.pageSize = size;
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.message.success('Пользователь успешно удален');
        // Обновляем список пользователей после удаления
        this.users = this.users.filter(user => user.id !== id);
        this.onSearch(); // Обновляем отфильтрованный список
      },
      error: (error) => {
        this.message.error('Не удалось удалить пользователя');
        console.error('Ошибка при удалении пользователя:', error);
      }
    });
  }
}
