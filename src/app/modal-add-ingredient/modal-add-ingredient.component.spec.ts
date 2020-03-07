import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddIngredientComponent } from './modal-add-ingredient.component';

describe('ModalAddIngredientComponent', () => {
  let component: ModalAddIngredientComponent;
  let fixture: ComponentFixture<ModalAddIngredientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddIngredientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
