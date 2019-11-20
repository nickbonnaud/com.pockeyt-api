import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersCenterComponent } from './customers-center.component';

describe('CustomersCenterComponent', () => {
  let component: CustomersCenterComponent;
  let fixture: ComponentFixture<CustomersCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
