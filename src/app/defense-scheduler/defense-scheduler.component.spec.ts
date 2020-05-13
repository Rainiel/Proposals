import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseSchedulerComponent } from './defense-scheduler.component';

describe('DefenseSchedulerComponent', () => {
  let component: DefenseSchedulerComponent;
  let fixture: ComponentFixture<DefenseSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefenseSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefenseSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
