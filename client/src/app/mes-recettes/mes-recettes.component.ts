import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, Form } from '@angular/forms';
import { RecipeDetails, RecettesService, CategoryDetails } from '../service/recettes.service';
import {HttpErrorResponse} from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-mes-recettes',
  templateUrl: './mes-recettes.component.html',
  styleUrls: ['./mes-recettes.component.css']
})
export class MesRecettesComponent implements OnInit {

  public recettes$: Observable<RecipeDetails[]>
  public categories: CategoryDetails[]
  public filteredRecipe$: Observable<RecipeDetails[]>
  public filter: FormControl
  public filter$: Observable<string>

  constructor(private recetteService: RecettesService, private router: Router) {
    //pour la recherche dynamique
    this.recettes$ = this.recetteService.getFavoris()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))
  } 

  ngOnInit(): void {
    this.recetteService.getAllCategory().subscribe(
      res => {
        this.categories = res
      }
    )
  }

  getFavoris() {
    this.recettes$ = this.recetteService.getFavoris()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))

  }

  getFavorisByCategory(idCategorie: any){
   
    this.recettes$ = this.recetteService.getFavorisByCategory(idCategorie)
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))
  }
  //voir si on peut la récupérer au lieu de la recopier!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        console.log(res)
        this.router.navigate(['/recipe', recette.idRecette])
      }, err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 402) {
          console.log("Cette recette n'existe pas !")
        }
      }
    })
  }

  delateFavoris(idRecette: any) {
    this.recetteService.deleteFavoris(idRecette)
      .subscribe(res => {
        this.router.navigate(['/favorites'], {
          queryParams: {refresh: new Date().getTime()}
       })
        }, (err) => {
          console.log(err);
        }
      );
      window.location.reload() /* rafraichit la page */
  }

}
