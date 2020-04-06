import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RecipeDetails, RecettesService, CategoryDetails, AuthentificationService, FavorisDetails } from '../../service';
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-recettes',
  templateUrl: './recettes.component.html',
  styleUrls: ['./recettes.component.scss']
})
export class RecettesComponent implements OnInit {

  public recettes$: Observable<RecipeDetails[]>
  public categories: CategoryDetails[]
  public filteredRecipe$: Observable<RecipeDetails[]>
  public filter: FormControl
  public filter$: Observable<string>

  public newFavori: FavorisDetails = {
    pseudo : this.auth.getUserDetails().pseudo,
    idRecette : null 
  }

  constructor(private recetteService: RecettesService, private router: Router, public auth: AuthentificationService) {
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

  addFavoris(id: number) {
    this.newFavori.idRecette = id
    this.recetteService.addFavoris(this.newFavori)
    this.router.navigateByUrl('/favorites').then(() => {
      window.location.reload()
    })
  }

  addTimes (startTime, endTime) {
    var times = [ 0, 0, 0 ]
    var max = times.length
  
    var a = (startTime || '').split(':')
    var b = (endTime || '').split(':')
  
    // normalize time values
    for (var i = 0; i < max; i++) {
      a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
    }
  
    // store time values
    for (var i = 0; i < max; i++) {
      times[i] = a[i] + b[i]
    }
  
    var hours = times[0]
    var minutes = times[1]
    var seconds = times[2]
  
    if (seconds >= 60) {
      var m = (seconds / 60) << 0
      minutes += m
      seconds -= 60 * m
    }
  
    if (minutes >= 60) {
      var h = (minutes / 60) << 0
      hours += h
      minutes -= 60 * h
    }
  
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
  }
}
