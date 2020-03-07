import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, Form } from '@angular/forms';
import { IngredientDetails, RecettesService} from '../service/recettes.service';
import {HttpErrorResponse} from '@angular/common/http'
import { Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  public ingredients$: Observable<IngredientDetails[]>
  public ingredients: IngredientDetails[]

  public ingredient: IngredientDetails = {
    idIngredient: null,
    nomIngredient: '',
    qte: null,
    libelleUnite: '',
  }
  
  public filteredIngredient$: Observable<IngredientDetails[]>
  public filter: FormControl
  public filter$: Observable<string>
  

  constructor(private recettesService: RecettesService, private router: Router) { 
     //pour la recherche dynamique
     this.ingredients$ = this.recettesService.getAllIngredients()
     this.filter = new FormControl('')
     this.filter$ = this.filter.valueChanges.pipe(startWith(''))
     this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
       .pipe(map(([ingredients, filterString]) =>
         ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))
  }

  ngOnInit(): void {
  }

  getAllIngredients() {

    this.ingredients$ = this.recettesService.getAllIngredients()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
      .pipe(map(([ingredients, filterString]) =>
        ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))

  }

  deleteIngredient(idIngredient: any) {
    this.recettesService.deleteIngredient(idIngredient)
      .subscribe(res => {
        this.router.navigate(['/ingredient'], {
          queryParams: {refresh: new Date().getTime()}
       })
        }, (err) => {
          console.log(err);
        }
      );
      window.location.reload() /* rafraichit la page */
  }


  updateIngredient(ingredient: IngredientDetails){
    this.recettesService.updateIngredient(ingredient).subscribe((res: any) => {
        window.location.reload()
      },(err: any) => {
        console.error(err)
      }
    );
  }

  addIngredient(){
    this.recettesService.addIngredient(this.ingredient)
    window.location.reload()
  }

}
