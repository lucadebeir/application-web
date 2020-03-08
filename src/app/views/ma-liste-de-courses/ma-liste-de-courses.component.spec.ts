import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaListeDeCoursesComponent } from './ma-liste-de-courses.component';

describe('MaListeDeCoursesComponent', () => {
  let component: MaListeDeCoursesComponent;
  let fixture: ComponentFixture<MaListeDeCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaListeDeCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaListeDeCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
