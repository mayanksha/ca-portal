import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSubmissionComponent } from './link-submission.component';

describe('LinkSubmissionComponent', () => {
  let component: LinkSubmissionComponent;
  let fixture: ComponentFixture<LinkSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
