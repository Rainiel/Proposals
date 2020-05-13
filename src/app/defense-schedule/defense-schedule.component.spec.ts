import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseScheduleComponent } from './defense-schedule.component';

describe('DefenseScheduleComponent', () => {
  let component: DefenseScheduleComponent;
  let fixture: ComponentFixture<DefenseScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefenseScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefenseScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
