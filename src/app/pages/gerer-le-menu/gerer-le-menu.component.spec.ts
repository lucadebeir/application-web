import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GererLeMenuComponent } from './gerer-le-menu.component';

describe('GererLeMenuComponent', () => {
  let component: GererLeMenuComponent;
  let fixture: ComponentFixture<GererLeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GererLeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GererLeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
