import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RecipeDetails, RecettesService } from '../../service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerer-les-recettes',
  templateUrl: './gerer-les-recettes.component.html',
  styleUrls: ['./gerer-les-recettes.component.css']
})
export class GererLesRecettesComponent implements OnInit {

  public recette: RecipeDetails
  public recettes$: Observable<RecipeDetails[]>
  public filteredRecipe$: Observable<RecipeDetails[]>
  public filter: FormControl
  public filter$: Observable<string>

  constructor(private recettesService: RecettesService, private router: Router) { 
    //pour la recherche dynamique
    this.recettes$ = this.recettesService.getAllRecipes()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))
  }

  ngOnInit(): void {
    
  }
  
  deleteRecipe(idRecette: any) {
    this.recettesService.deleteRecipe(idRecette)
      .subscribe(res => {
        this.router.navigate(['/handleRecipes']).then(() => {
          window.location.reload()
        })
        }, (err) => {
          console.log(err);
        }
      );
      window.location.reload() /* rafraichit la page */
  }
  

}

