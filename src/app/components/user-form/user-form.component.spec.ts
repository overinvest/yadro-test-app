import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let messageService: jasmine.SpyObj<NzMessageService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    phone: '123456789',
    website: 'example.com',
    address: {
      street: 'Test Street',
      suite: 'Suite 1',
      city: 'Test City',
      zipcode: '12345',
      geo: {
        lat: '123',
        lng: '456'
      }
    },
    company: {
      name: 'Test Company',
      catchPhrase: 'Test Catchphrase',
      bs: 'Test BS'
    }
  };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUser', 'createUser', 'updateUser'
    ]);
    const messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzMessageModule,
        NzCardModule,
        NzSpinModule,
        NzIconModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: NzMessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    messageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.get('name')).toBeDefined();
    expect(component.userForm.get('username')).toBeDefined();
    expect(component.userForm.get('email')).toBeDefined();
    expect(component.userForm.get('phone')).toBeDefined();
    expect(component.userForm.get('website')).toBeDefined();
    expect(component.userForm.get('address')).toBeDefined();
    expect(component.userForm.get('company')).toBeDefined();
  });

  it('should load user data in edit mode', () => {
    // Setup component in edit mode with a user ID
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzMessageModule,
        NzCardModule,
        NzSpinModule,
        NzIconModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userService },
        { provide: NzMessageService, useValue: messageService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    });

    userService.getUser.and.returnValue(of(mockUser));

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(userService.getUser).toHaveBeenCalledWith(1);
    expect(component.isEditMode).toBe(true);
    expect(component.userId).toBe(1);
  });

  it('should create a new user when form is submitted in create mode', () => {
    const newUser = { ...mockUser, id: undefined };
    component.userForm.patchValue(newUser);
    userService.createUser.and.returnValue(of(mockUser));

    component.submitForm();

    expect(userService.createUser).toHaveBeenCalled();
    expect(messageService.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/users', mockUser.id]);
  });

  it('should update a user when form is submitted in edit mode', () => {
    component.isEditMode = true;
    component.userId = 1;
    component.userForm.patchValue(mockUser);
    userService.updateUser.and.returnValue(of(mockUser));

    component.submitForm();

    expect(userService.updateUser).toHaveBeenCalled();
    expect(messageService.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/users', 1]);
  });

  it('should not submit form when form is invalid', () => {
    component.userForm.get('name')?.setValue('');
    component.userForm.get('email')?.setValue('invalid-email');

    component.submitForm();

    expect(userService.createUser).not.toHaveBeenCalled();
    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('should show error when creating user fails', () => {
    component.userForm.patchValue(mockUser);
    userService.createUser.and.returnValue(throwError(() => new Error('Create failed')));

    component.submitForm();

    expect(userService.createUser).toHaveBeenCalled();
    expect(messageService.error).toHaveBeenCalled();
    expect(component.submitting).toBeFalse();
  });

  it('should show error when updating user fails', () => {
    component.isEditMode = true;
    component.userId = 1;
    component.userForm.patchValue(mockUser);
    userService.updateUser.and.returnValue(throwError(() => new Error('Update failed')));

    component.submitForm();

    expect(userService.updateUser).toHaveBeenCalled();
    expect(messageService.error).toHaveBeenCalled();
    expect(component.submitting).toBeFalse();
  });

  it('should reset form', () => {
    const formResetSpy = spyOn(component.userForm, 'reset');
    component.resetForm();
    expect(formResetSpy).toHaveBeenCalled();
  });

  it('should reload user data when reset in edit mode', () => {
    spyOn(component, 'loadUserData');
    component.isEditMode = true;

    component.resetForm();

    expect(component.loadUserData).toHaveBeenCalled();
  });
});
