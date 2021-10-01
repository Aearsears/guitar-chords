import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosToChordComponent } from './pos-to-chord.component';

describe('PosToChordComponent', () => {
  let component: PosToChordComponent;
  let fixture: ComponentFixture<PosToChordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosToChordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosToChordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
