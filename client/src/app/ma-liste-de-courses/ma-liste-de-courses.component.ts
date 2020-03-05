import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, Form } from '@angular/forms';
import { RecettesService, IngredientDetails } from '../service/recettes.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router'
import { AuthentificationService } from '../service/authentification.service';


@Component({
  selector: 'app-ma-liste-de-courses',
  templateUrl: './ma-liste-de-courses.component.html',
  styleUrls: ['./ma-liste-de-courses.component.css']
})
export class MaListeDeCoursesComponent implements OnInit {
  public ingredients$: Observable<IngredientDetails[]>
  public ingredients: IngredientDetails[]

  public ingredient: IngredientDetails

  public filteredIngredient$: Observable<IngredientDetails[]>
  public filter: FormControl
  public filter$: Observable<string>

  public ingredientToDelete: IngredientToDelete = {
    pseudo: this.auth.getUserDetails().pseudo,
    idIngredient: null
  }


  constructor(private recetteService: RecettesService, private router: Router, private auth: AuthentificationService) {
    this.ingredients$ = this.recetteService.getListeCourses()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
      .pipe(map(([ingredients, filterString]) =>
        ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))

  }

  ngOnInit(): void {

  }

  getListeCourses() {
    this.ingredients$ = this.recetteService.getListeCourses()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
      .pipe(map(([ingredients, filterString]) =>
        ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))

  }
  
  deleteListeCourse(idIngredient: any) {
    this.ingredientToDelete.idIngredient = idIngredient
    console.log(this.ingredientToDelete)
    this.recetteService.deleteListeCourse(idIngredient)
      .subscribe(res => {
        this.router.navigate(['/shoppingList'], {
          queryParams: { refresh: new Date().getTime() }
        })
      }, (err) => {
        console.log(err);
      }
      );
    window.location.reload() /* rafraichit la page */
  }
}

export interface IngredientToDelete {
  pseudo: string
  idIngredient: number
}