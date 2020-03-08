import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCommentairesComponent } from './mes-commentaires.component';

describe('MesCommentairesComponent', () => {
  let component: MesCommentairesComponent;
  let fixture: ComponentFixture<MesCommentairesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesCommentairesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesCommentairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
