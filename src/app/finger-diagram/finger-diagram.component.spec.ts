import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerDiagramComponent } from './finger-diagram.component';

describe('FingerDiagramComponent', () => {
  let component: FingerDiagramComponent;
  let fixture: ComponentFixture<FingerDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FingerDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FingerDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
