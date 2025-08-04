export interface OrderItem {
  id?: number;
  productId: number;
  productTitle?: string;
  quantity: number;
  unitPrice?: number;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  totalAmount: number | null;
  discountAmount: number;
  finalAmount: number;
  promotionId: string;
  promotionName: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  };
  createdByName: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  customerId: string;
  items: CreateOrderItem[];
} 