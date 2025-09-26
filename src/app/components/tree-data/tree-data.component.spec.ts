import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDataComponent } from './tree-data.component';

describe('TreeDataComponent', () => {
  let component: TreeDataComponent;
  let fixture: ComponentFixture<TreeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
