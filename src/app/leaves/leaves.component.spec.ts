import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesComponent } from './leaves.component';

describe('LeavesComponent', () => {
  let component: LeavesComponent;
  let fixture: ComponentFixture<LeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
