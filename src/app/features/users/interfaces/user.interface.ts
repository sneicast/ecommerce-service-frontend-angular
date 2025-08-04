export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
  password: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
} 