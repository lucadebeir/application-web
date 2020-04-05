import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RecipeDetails, RecettesService, CategoryDetails } from '../../service';
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-recettes',
  templateUrl: './recettes.component.html',
  styleUrls: ['./recettes.component.css']
})
export class RecettesComponent implements OnInit {

  public recettes$: Observable<RecipeDetails[]>
  public categories: CategoryDetails[]
  public filteredRecipe$: Observable<RecipeDetails[]>
  public filter: FormControl
  public filter$: Observable<string>

  constructor(private recetteService: RecettesService, private router: Router) {
    //pour la recherche dynamique
    this.recettes$ = this.recetteService.getAllRecipesAndIngredients()
    this.recettes$.subscribe(data => {
      console.log(data)
    })

    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) => {
        return recipes.filter(recipe => 
          
          recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 ||
          recipe.ingredients.forEach(element =>
              element.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
          
      )}))
    
    this.filteredRecipe$.subscribe(data => {
      console.log(data)
    })
    this.filter$.subscribe(data => {
      console.log(data)
    })
  }

  //dans ngOnInit on récupère les données à afficher au lancement de la page
  ngOnInit(): void {
    this.getAllCategory()
  }

  getAllRecipes() {

    this.recettes$ = this.recetteService.getAllRecipesAndIngredients()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe =>
          recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))
  }

  getImageByIdRecipe(id: number): any {
    this.recetteService.getImage(id).subscribe(
      res => {
        console.log(res)
        return res.lienImage
      })
  }

  getAllCategory() {
    this.recetteService.getAllCategory().subscribe(
      (categorie: CategoryDetails[]) => {

        this.categories = categorie
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas de catégorie.")


          }

        }
      }
    )
  }

  getRecipeByCategory(idCategorie: any) {

    this.recettes$ = this.recetteService.getRecipeByCategory(idCategorie)
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))
  }

  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.router.navigate(['/recipe', recette.idRecette]).then(() => {
          window.location.reload()
        })
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Cette recette n'existe pas !")
          }
        }
      })
  }
}
