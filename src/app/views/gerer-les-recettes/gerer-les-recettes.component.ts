import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, combineLatest, from, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RecipeDetails, RecettesService } from '../../service';
import { Router } from '@angular/router';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'app-gerer-les-recettes',
  templateUrl: './gerer-les-recettes.component.html',
  styleUrls: ['./gerer-les-recettes.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class GererLesRecettesComponent implements OnInit {

  watcher: Subscription;

  opened = true;
  over = 'side';
  expandHeight = '42px';
  collapseHeight = '42px';
  displayMode = 'flat';

  public recette: RecipeDetails
  public recettes$: Observable<RecipeDetails[]>
  public filteredRecipe$: Observable<RecipeDetails[]>
  public filter: FormControl
  public filter$: Observable<string>

  constructor(private recettesService: RecettesService, private router: Router, media: MediaObserver) {
    //pour la recherche dynamique
    this.recettes$ = this.recettesService.getAllRecipes()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))

    this.watcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.opened = false;
        this.over = 'over';
      } else {
        this.opened = true;
        this.over = 'side';
      }
    });
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

