import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsPage } from './promotions-page';

describe('PromotionsPage', () => {
  let component: PromotionsPage;
  let fixture: ComponentFixture<PromotionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
