import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { RecipeDetails, RecettesService, CategoryDetails, AuthentificationService, FavorisDetails, IngredientDetails } from '../../service';
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-recettes',
  templateUrl: './recettes.component.html',
  styleUrls: ['./recettes.component.scss']
})
export class RecettesComponent implements OnInit {

  public actualCategory: number = null
  public recipeByCategory: HashTable<RecipeDetails[]> = {}
  public recipeCategory: RecipeDetails[] = []

  public recettes$: Observable<RecipeDetails[]>
  public categories: CategoryDetails[]
  public filteredRecipe$: Observable<RecipeDetails[]>
  public filter: FormControl
  public filter$: Observable<string>

  public newFavori: FavorisDetails = {
    pseudo: '',
    idRecette: null
  }
  public favoris: number[] = []

  public researchForm: FormGroup

  public allRecipe: RecipeDetails[]
  public allRecipe2: RecipeDetails[]

  constructor(private recetteService: RecettesService, private router: Router, public auth: AuthentificationService, private formBuilder: FormBuilder) {
    //pour la recherche dynamique
    this.recettes$ = this.recetteService.getAllRecipesAndIngredients()

    this.recetteService.getAllRecipesAndIngredients().subscribe(data => {
      this.allRecipe = data
      this.allRecipe2 = data
    })


    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) => {
        return recipes.filter(recipe =>
          recipe.ingredients.filter(ingredient =>
            ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
          && recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
        )
      }))

    if (this.auth.isLoggedIn()) {
      this.newFavori.pseudo = this.auth.getUserDetails().pseudo
      this.getFavoris()
    }

    this.recetteService.getAllCategory().subscribe(
      (categorie: CategoryDetails[]) => {
        this.categories = categorie
        categorie.forEach(data => {
          this.recetteService.getRecipeByCategory(data.idCategorie).subscribe(recipes => {
            this.recipeCategory = recipes
            this.recipeByCategory[data.idCategorie] = this.recipeCategory
          })
        })
      })
    this.initResearchForm()
  }

  //dans ngOnInit on récupère les données à afficher au lancement de la page
  ngOnInit(): void {

  }

  ngOnChanges() {
    this.allRecipe = this.allRecipe2
    this.initResearchForm()
  }

  initResearchForm() {
    this.researchForm = this.formBuilder.group({
      filter: ['']
    });
  }

  research() {
    const formValue = this.researchForm.value;

    if (this.actualCategory != null) {
      if (formValue.filter != '') {
        let researchResult: RecipeDetails[] = []
        this.recipeByCategory[this.actualCategory].forEach(recipe => {
          if (recipe.nomRecette.toLowerCase().indexOf(formValue.filter.toLowerCase()) !== -1) {
            if (!researchResult.includes(recipe)) {
              researchResult.push(recipe)
            }
          }
          recipe.ingredients.forEach(ingredient => {
            if (ingredient.nomIngredient.toLowerCase().indexOf(formValue.filter.toLowerCase()) !== -1) {
              if (!researchResult.includes(recipe)) {
                researchResult.push(recipe)
              }
            }
          })
        })
        this.allRecipe = researchResult
      } else {
        this.allRecipe = this.allRecipe2
      }
    } else {
      if (formValue.filter != '') {
        let researchResult: RecipeDetails[] = []

        this.allRecipe2.forEach(recipe => {
          if (recipe.nomRecette.toLowerCase().indexOf(formValue.filter.toLowerCase()) !== -1) {
            if (!researchResult.includes(recipe)) {
              researchResult.push(recipe)
            }
          }
          recipe.ingredients.forEach(ingredient => {
            if (ingredient.nomIngredient.toLowerCase().indexOf(formValue.filter.toLowerCase()) !== -1) {
              if (!researchResult.includes(recipe)) {
                researchResult.push(recipe)
              }
            }
          })
        })
        this.allRecipe = researchResult
      } else {
        this.allRecipe = this.allRecipe2
      }
    }



  }

  getAllRecipes() {

    this.actualCategory = null

    this.recettes$ = this.recetteService.getAllRecipesAndIngredients()

    this.recetteService.getAllRecipesAndIngredients().subscribe(data => {
      this.allRecipe = data
    })

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

    this.actualCategory = idCategorie

    this.recettes$ = this.recetteService.getRecipeByCategory(idCategorie)

    this.recetteService.getRecipeByCategory(idCategorie).subscribe(data => {
      this.allRecipe = data
    })

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

  addFavoris(id: number) {
    this.newFavori.idRecette = id
    this.recetteService.addFavoris(this.newFavori).subscribe(res => {
      this.getFavoris()
    })
  }


  getFavoris() {
    this.favoris = []
    this.recetteService.getFavoris().subscribe(
      (favoris: RecipeDetails[]) => {
        console.log(favoris)
        favoris.forEach(element => {
          this.favoris.push(element.idRecette)

          console.log(this.favoris)
        })

      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Cette user n'a pas de favoris")
          }
        }
      })
  }

  deleteFavoris(idRecette: any) {
    this.recetteService.deleteFavoris(idRecette).subscribe(res => {
      this.getFavoris()
    }) /* rafraichit la page */
  }
}

export interface HashTable<T> {
  [key: number]: T;
}
