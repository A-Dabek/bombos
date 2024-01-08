import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureFoodComponent } from './feature-food.component';

describe('FeatureFoodComponent', () => {
  let component: FeatureFoodComponent;
  let fixture: ComponentFixture<FeatureFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureFoodComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
