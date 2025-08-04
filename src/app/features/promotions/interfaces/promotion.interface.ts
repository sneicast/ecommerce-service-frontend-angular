export interface Promotion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  globalDiscountPercentage: number;
  randomOrderDiscountPercentage: number;
  createdAt: string;
  createdById: string;
  createdByFullName: string;
}

export interface CreatePromotionRequest {
  name: string;
  startDate: string;
  endDate: string;
  globalDiscountPercentage: number;
  randomOrderDiscountPercentage: number;
} 