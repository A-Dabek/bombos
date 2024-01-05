import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePackagesComponent } from './feature-packages.component';

describe('FeaturePackagesComponent', () => {
  let component: FeaturePackagesComponent;
  let fixture: ComponentFixture<FeaturePackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePackagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
