import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    NzCardModule,
    NzSpinModule,
    NzIconModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId: number | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Проверяем, находимся ли мы в режиме редактирования
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.isEditMode = true;
        this.loadUserData();
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      website: [''],
      address: this.fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: [''],
        geo: this.fb.group({
          lat: [''],
          lng: ['']
        })
      }),
      company: this.fb.group({
        name: [''],
        catchPhrase: [''],
        bs: ['']
      })
    });
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.loading = true;
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.loading = false;
      },
      error: (error) => {
        this.message.error('Не удалось загрузить данные пользователя');
        console.error('Ошибка при загрузке данных пользователя:', error);
        this.loading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const userData: User = this.userForm.value;
    this.submitting = true;

    if (this.isEditMode && this.userId) {
      // Обновление существующего пользователя
      userData.id = this.userId;
      this.userService.updateUser(userData).subscribe({
        next: () => {
          this.message.success('Пользователь успешно обновлен');
          this.submitting = false;
          this.router.navigate(['/users', this.userId]);
        },
        error: (error) => {
          this.message.error('Не удалось обновить пользователя');
          console.error('Ошибка при обновлении пользователя:', error);
          this.submitting = false;
        }
      });
    } else {
      // Создание нового пользователя
      this.userService.createUser(userData).subscribe({
        next: (newUser) => {
          this.message.success('Пользователь успешно создан');
          this.submitting = false;
          this.router.navigate(['/users', newUser.id]);
        },
        error: (error) => {
          this.message.error('Не удалось создать пользователя');
          console.error('Ошибка при создании пользователя:', error);
          this.submitting = false;
        }
      });
    }
  }

  resetForm(): void {
    this.userForm.reset();
    if (this.isEditMode) {
      this.loadUserData();
    }
  }
}
