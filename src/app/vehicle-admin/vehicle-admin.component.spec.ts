import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAdminComponent } from './vehicle-admin.component';

describe('VehicleAdminComponent', () => {
  let component: VehicleAdminComponent;
  let fixture: ComponentFixture<VehicleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
