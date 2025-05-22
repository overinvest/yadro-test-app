import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { User } from '../models/user';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return all users', () => {
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

      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpTestingController.expectOne('https://jsonplaceholder.typicode.com/users');
      expect(req.request.method).toEqual('GET');
      req.flush(mockUsers);
    });
  });

  describe('getUser', () => {
    it('should return a single user by id', () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '1234567890',
        website: 'test.com'
      };

      service.getUser(1).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne('https://jsonplaceholder.typicode.com/users/1');
      expect(req.request.method).toEqual('GET');
      req.flush(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '1234567890',
        website: 'test.com'
      };

      service.createUser(mockUser).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne('https://jsonplaceholder.typicode.com/users');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(mockUser);
      req.flush(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const mockUser: User = {
        id: 1,
        name: 'Updated User',
        username: 'updateduser',
        email: 'updated@example.com',
        phone: '1234567890',
        website: 'updated.com'
      };

      service.updateUser(mockUser).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne('https://jsonplaceholder.typicode.com/users/1');
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(mockUser);
      req.flush(mockUser);
    });
  });

  describe('patchUser', () => {
    it('should partially update an existing user', () => {
      const userId = 1;
      const partialUser = { name: 'Patched Name' };
      const mockResponse: User = {
        id: 1,
        name: 'Patched Name',
        username: 'testuser',
        email: 'test@example.com',
        phone: '1234567890',
        website: 'test.com'
      };

      service.patchUser(userId, partialUser).subscribe(user => {
        expect(user).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne('https://jsonplaceholder.typicode.com/users/1');
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(partialUser);
      req.flush(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      service.deleteUser(1).subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpTestingController.expectOne('https://jsonplaceholder.typicode.com/users/1');
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });
  });
});
