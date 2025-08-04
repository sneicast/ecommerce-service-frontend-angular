export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber: string;
} 