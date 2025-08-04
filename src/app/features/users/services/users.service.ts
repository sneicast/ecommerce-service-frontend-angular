import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiService: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/api/v1/users');
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`/api/v1/users/${id}`);
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.apiService.post<User>('/api/v1/users', user);
  }

  updateUser(id: string, user: UpdateUserRequest): Observable<User> {
    return this.apiService.put<User>(`/api/v1/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`/api/v1/users/${id}`);
  }
}
