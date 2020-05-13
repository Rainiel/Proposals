import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeNavigationComponent } from './committee-navigation.component';

describe('CommitteeNavigationComponent', () => {
  let component: CommitteeNavigationComponent;
  let fixture: ComponentFixture<CommitteeNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
