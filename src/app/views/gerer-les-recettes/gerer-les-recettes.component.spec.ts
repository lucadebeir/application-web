import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GererLesRecettesComponent } from './gerer-les-recettes.component';

describe('GererLesRecettesComponent', () => {
  let component: GererLesRecettesComponent;
  let fixture: ComponentFixture<GererLesRecettesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GererLesRecettesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GererLesRecettesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
