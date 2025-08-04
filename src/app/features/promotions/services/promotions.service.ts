import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Promotion, CreatePromotionRequest } from '../interfaces/promotion.interface';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {
  constructor(private apiService: ApiService) {}

  getPromotions(): Observable<Promotion[]> {
    return this.apiService.get<Promotion[]>('/api/v1/promotions');
  }

  createPromotion(promotion: CreatePromotionRequest): Observable<Promotion> {
    return this.apiService.post<Promotion>('/api/v1/promotions', promotion);
  }
} 