import { Component, OnInit, OnChanges } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { RecettesService, AuthentificationService, FavorisService, CategoriesService } from '../../service';
import { RecipeDetails, CategoryDetails } from '../../models';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { HashTable } from '../recettes/recettes.component';

@Component({
  selector: 'app-mes-recettes',
  templateUrl: './mes-recettes.component.html',
  styleUrls: ['./mes-recettes.component.scss']
})
export class MesRecettesComponent implements OnInit, OnChanges {

  page = 1;

  public actualCategory: number = null;
  public recipeByCategory: HashTable<RecipeDetails[]> = {};
  public recipeCategory: RecipeDetails[] = [];

  public researchForm: FormGroup;

  public allRecipe: RecipeDetails[];
  public allRecipe2: RecipeDetails[];

  public recettes$: Observable<RecipeDetails[]>;
  public categories: CategoryDetails[];
  public filteredRecipe$: Observable<RecipeDetails[]>;
  public filter: FormControl;
  public filter$: Observable<string>;

  constructor(private recetteService: RecettesService, private router: Router, private formBuilder: FormBuilder,
              public auth: AuthentificationService, private favorisService: FavorisService, private categoriesService: CategoriesService) {

    // pour la recherche dynamique
    this.recettes$ = this.favorisService.getFavoris();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    // tslint:disable-next-line: deprecation
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));

    this.favorisService.getFavoris().subscribe(data => {
      this.allRecipe = data;
      this.allRecipe2 = data;
    });

    this.categoriesService.getAllCategory().subscribe(
      (categorie: CategoryDetails[]) => {
        categorie.forEach(data => {
          this.favorisService.getFavorisByCategory(data.idCategorie).subscribe(recipes => {
            this.recipeCategory = recipes;
            this.recipeByCategory[data.idCategorie] = this.recipeCategory;
          });
        });
        this.categories = categorie;
      });

    this.initResearchForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.allRecipe = this.allRecipe2;
    this.initResearchForm();
  }

  initResearchForm() {
    this.researchForm = this.formBuilder.group({
      filter: ['']
    });
  }

  research() {
    const formValue = this.researchForm.value;

    if (this.actualCategory != null) {
      if (formValue.filter !== '') {
        const researchResult: RecipeDetails[] = [];
        this.recipeByCategory[this.actualCategory].forEach(recipe => {
          if (recipe.nomRecette.toLowerCase().indexOf(formValue.filter.toLowerCase()) !== -1) {
            if (!researchResult.includes(recipe)) {
              researchResult.push(recipe);
            }
          }
          recipe.ingredients.forEach(ingredient => {
            if (ingredient.nomIngredient.toLowerCase().indexOf(formValue.filter.toLowerCase()) !== -1) {
              if (!researchResult.includes(recipe)) {
                researchResult.push(recipe);
              }
            }
          });
        });
        this.allRecipe = researchResult;
      } else {
        this.allRecipe = this.allRecipe2;
      }
    } else {
      if (formValue.filter !== '') {
        const researchResult: RecipeDetails[] = [];

        this.allRecipe2.forEach(recipe => {
          if (recipe.nomRecette.toLowerCase().indexOf(formValue.filter.toLowerCase()) !== -1) {
            if (!researchResult.includes(recipe)) {
              researchResult.push(recipe);
            }
          }
          console.log(recipe);
          recipe.ingredients.forEach(ingredient => {
            if (ingredient.nomIngredient.toLowerCase().indexOf(formValue.filter.toLowerCase()) !== -1) {
              if (!researchResult.includes(recipe)) {
                researchResult.push(recipe);
              }
            }
          });
        });
        this.allRecipe = researchResult;
      } else {
        this.allRecipe = this.allRecipe2;
      }
    }



  }

  getFavoris() {
    this.favorisService.getFavoris().subscribe(data => {
      this.allRecipe = data;
      this.allRecipe2 = data;
    });
  }

  getFavorisByCategory(idCategorie: any) {

    this.actualCategory = idCategorie;

    this.recettes$ = this.recetteService.getRecipeByCategory(idCategorie);

    this.favorisService.getFavorisByCategory(idCategorie).subscribe(data => {
      this.allRecipe = data;
    });

    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    // tslint:disable-next-line: deprecation
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$)
      .pipe(map(([recipes, filterString]) =>
        recipes.filter(recipe => recipe.nomRecette.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));
  }

  // voir si on peut la récupérer au lieu de la recopier!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.router.navigate(['/recipe', recette.idRecette]).then(() => {
          window.location.reload();
        });
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log('Cette recette n\'existe pas !');
          }
        }
      });
  }


  deleteFavoris(idRecette: any) {
    this.favorisService.deleteFavoris(idRecette)
      .subscribe(res => {
        this.router.navigate(['/favorites'], {
          queryParams: { refresh: new Date().getTime() }
        });
      }, (err) => {
        console.log(err);
      }
      );
    this.favorisService.getFavoris().subscribe(data => {
        this.allRecipe = data;
      }); /* rafraichit la page */
  }

}
