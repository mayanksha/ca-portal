import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbpostsComponent } from './fbposts.component';

describe('FbpostsComponent', () => {
  let component: FbpostsComponent;
  let fixture: ComponentFixture<FbpostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbpostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
