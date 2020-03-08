import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesRecettesComponent } from './mes-recettes.component';

describe('MesRecettesComponent', () => {
  let component: MesRecettesComponent;
  let fixture: ComponentFixture<MesRecettesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesRecettesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesRecettesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
