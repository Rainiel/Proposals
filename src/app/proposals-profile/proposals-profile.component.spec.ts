import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalsProfileComponent } from './proposals-profile.component';

describe('ProposalsProfileComponent', () => {
  let component: ProposalsProfileComponent;
  let fixture: ComponentFixture<ProposalsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
