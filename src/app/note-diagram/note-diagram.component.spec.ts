import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDiagramComponent } from './note-diagram.component';

describe('NoteDiagramComponent', () => {
  let component: NoteDiagramComponent;
  let fixture: ComponentFixture<NoteDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
