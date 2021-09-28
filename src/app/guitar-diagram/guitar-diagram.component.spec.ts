import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuitarDiagramComponent } from './guitar-diagram.component';

describe('GuitarDiagramComponent', () => {
  let component: GuitarDiagramComponent;
  let fixture: ComponentFixture<GuitarDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuitarDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuitarDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
