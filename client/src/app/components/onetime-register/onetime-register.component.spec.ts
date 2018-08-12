import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnetimeRegisterComponent } from './onetime-register.component';

describe('OnetimeRegisterComponent', () => {
  let component: OnetimeRegisterComponent;
  let fixture: ComponentFixture<OnetimeRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnetimeRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnetimeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
