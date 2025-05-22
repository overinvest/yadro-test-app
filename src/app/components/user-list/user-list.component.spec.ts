import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let messageService: jasmine.SpyObj<NzMessageService>;

  // Мокированные данные пользователей
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Test User 1',
      username: 'testuser1',
      email: 'test1@example.com',
      phone: '1234567890',
      website: 'test1.com'
    },
    {
      id: 2,
      name: 'Test User 2',
      username: 'testuser2',
      email: 'test2@example.com',
      phone: '0987654321',
      website: 'test2.com'
    }
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser']);
    const messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        NzTableModule,
        NzButtonModule,
        NzIconModule,
        NzInputModule,
        NzMessageModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: NzMessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    messageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService.getUsers.and.returnValue(of(mockUsers));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
    expect(component.filteredUsers.length).toBe(2);
  });

  it('should filter users by name', () => {
    component.searchValue = 'Test User 1';
    component.onSearch();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].id).toBe(1);
  });

  it('should filter users by email', () => {
    component.searchValue = 'test2@example';
    component.onSearch();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].id).toBe(2);
  });

  it('should restore all users when search is cleared', () => {
    component.searchValue = 'Test User 1';
    component.onSearch();
    expect(component.filteredUsers.length).toBe(1);

    component.searchValue = '';
    component.onSearch();
    expect(component.filteredUsers.length).toBe(2);
  });

  it('should change page size', () => {
    component.pageSizeChange(20);
    expect(component.pageSize).toBe(20);
  });

  it('should delete user and update list', () => {
    userService.deleteUser.and.returnValue(of({}));

    component.deleteUser(1);

    expect(userService.deleteUser).toHaveBeenCalledWith(1);
    expect(messageService.success).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
    expect(component.users[0].id).toBe(2);
    expect(component.filteredUsers.length).toBe(1);
  });

  it('should show error message when delete fails', () => {
    userService.deleteUser.and.returnValue(throwError(() => new Error('Delete failed')));

    component.deleteUser(1);

    expect(userService.deleteUser).toHaveBeenCalledWith(1);
    expect(messageService.error).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should show error message when getUsers fails', () => {
    userService.getUsers.and.returnValue(throwError(() => new Error('Get users failed')));

    component.fetchUsers();

    expect(userService.getUsers).toHaveBeenCalled();
    expect(messageService.error).toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });
});
