import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRecettesComponent } from './filter-recettes.component';

describe('FilterRecettesComponent', () => {
  let component: FilterRecettesComponent;
  let fixture: ComponentFixture<FilterRecettesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterRecettesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterRecettesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
