import { Component, OnInit } from '@angular/core';
import { RecettesService, IngredientDetails } from '../service/recettes.service';
import { HttpErrorResponse, HttpResponse} from '@angular/common/http'
import {Router, ActivatedRoute} from '@angular/router'
import {Observable, of} from 'rxjs'

@Component({
  selector: 'app-ma-liste-de-courses',
  templateUrl: './ma-liste-de-courses.component.html',
  styleUrls: ['./ma-liste-de-courses.component.css']
})
export class MaListeDeCoursesComponent implements OnInit {

  public ingredients: Observable<IngredientDetails[]>

  constructor(private recetteService: RecettesService, private router: Router) { }

  ngOnInit(): void {
  }

}
