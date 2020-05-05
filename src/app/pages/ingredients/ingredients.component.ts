import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RecettesService, IngredientsService} from '../../service';
import { IngredientDetails } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {
  public ingredients$: Observable<IngredientDetails[]>;
  public ingredients: IngredientDetails[];

  public ingredient: IngredientDetails = {
    idIngredient: null,
    nomIngredient: '',
    qte: null,
    libelleUnite: '',
  };

  public filteredIngredient$: Observable<IngredientDetails[]>;
  public filter: FormControl;
  public filter$: Observable<string>;


  constructor(private recettesService: RecettesService, private router: Router, private ingredientsService: IngredientsService) {
     // pour la recherche dynamique
     this.ingredients$ = this.ingredientsService.getAllIngredients();
     this.filter = new FormControl('');
     this.filter$ = this.filter.valueChanges.pipe(startWith(''));
     // tslint:disable-next-line: deprecation
     this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
       .pipe(map(([ingredients, filterString]) =>
         ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));
  }

  ngOnInit(): void {
  }

  getAllIngredients() {

    this.ingredients$ = this.ingredientsService.getAllIngredients();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    // tslint:disable-next-line: deprecation
    this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
      .pipe(map(([ingredients, filterString]) =>
        ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));

  }

  deleteIngredient(idIngredient: any) {
    this.ingredientsService.deleteIngredient(idIngredient)
      .subscribe(res => {
        this.router.navigate(['/ingredient'], {
          queryParams: {refresh: new Date().getTime()}
       });
        }, (err) => {
          console.log(err);
        }
      );
    window.location.reload(); /* rafraichit la page */
  }


  updateIngredient(ingredient: IngredientDetails) {
    this.ingredientsService.updateIngredient(ingredient).subscribe((res: any) => {
        window.location.reload();
      }, (err: any) => {
        console.error(err);
      }
    );
  }

  addIngredient() {
    this.ingredientsService.addIngredient(this.ingredient);
    window.location.reload();
  }

}
