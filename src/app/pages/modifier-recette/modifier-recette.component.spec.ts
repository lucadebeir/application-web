import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierRecetteComponent } from './modifier-recette.component';

describe('ModifierRecetteComponent', () => {
  let component: ModifierRecetteComponent;
  let fixture: ComponentFixture<ModifierRecetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifierRecetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierRecetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
