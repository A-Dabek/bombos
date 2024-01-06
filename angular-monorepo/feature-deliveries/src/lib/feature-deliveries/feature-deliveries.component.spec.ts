import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureDeliveriesComponent } from './feature-deliveries.component';

describe('FeatureDeliveriesComponent', () => {
  let component: FeatureDeliveriesComponent;
  let fixture: ComponentFixture<FeatureDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureDeliveriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
