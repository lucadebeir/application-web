import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RecettesService } from '../../service';
import { RecipeDetails } from '../../models';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-gerer-les-recettes',
  templateUrl: './gerer-les-recettes.component.html',
  styleUrls: ['./gerer-les-recettes.component.scss']
})
export class GererLesRecettesComponent implements OnInit {

  watcher: Subscription;

  opened = true;
  over = 'side';
  expandHeight = '42px';
  collapseHeight = '42px';
  displayMode = 'flat';

  public recette: RecipeDetails;
  public recettes$: Observable<RecipeDetails[]>;
  public filteredRecipe$: Observable<RecipeDetails[]>;
  public filter: FormControl;
  public filter$: Observable<string>;

  constructor(private recettesService: RecettesService, private router: Router, media: MediaObserver) {
    // pour la recherche dynamique
    this.recettes$ = this.recettesService.getAllRecipes();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    // tslint:disable-next-line: deprecation
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));
  }

  ngOnInit(): void {

  }

  deleteRecipe(idRecette: any) {
    this.recettesService.deleteRecipe(idRecette)
      .subscribe(res => {
        this.router.navigate(['/handleRecipes']).then(() => {
          window.location.reload();
        });
      }, (err) => {
        console.log(err);
      }
      );
    window.location.reload(); /* rafraichit la page */
  }


}

