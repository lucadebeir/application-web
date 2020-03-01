import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerRecetteComponent } from './creer-recette.component';

describe('CreerRecetteComponent', () => {
  let component: CreerRecetteComponent;
  let fixture: ComponentFixture<CreerRecetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreerRecetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreerRecetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
