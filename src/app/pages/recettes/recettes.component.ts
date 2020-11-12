import { Component, OnInit, OnChanges } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import {
  RecettesService,
  AuthentificationService,
  ImagesService,
  CategoriesService,
  FavorisService,
} from "../../service";
import { RecipeDetails, CategoryDetails, FavorisDetails } from "../../models";
import { HttpErrorResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";

@Component({
  selector: "app-recettes",
  templateUrl: "./recettes.component.html",
  styleUrls: ["./recettes.component.scss"],
})
export class RecettesComponent implements OnInit, OnChanges {
  page = 1;

  public actualCategory: number = null;
  public recipeByCategory: HashTable<RecipeDetails[]> = {};
  public recipeCategory: RecipeDetails[] = [];

  public recettes$: Observable<RecipeDetails[]>;
  public categories: CategoryDetails[];
  public filteredRecipe$: Observable<RecipeDetails[]>;
  public filter: FormControl;
  public filter$: Observable<string>;

  public newFavori: FavorisDetails = {
    pseudo: "",
    idRecette: null,
  };
  public favoris: number[] = [];

  public researchForm: FormGroup;

  public allRecipe: RecipeDetails[];
  public allRecipe2: RecipeDetails[];
  currentPage: number;

  constructor(
    private recetteService: RecettesService,
    private router: Router,
    public auth: AuthentificationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    private categoriesService: CategoriesService,
    private favorisService: FavorisService,
    private notifService: NotificationService
  ) {
    // pour la recherche dynamique
    this.recettes$ = this.recetteService.getAllRecipesAndIngredients();

    if (this.route.snapshot.paramMap.get("id")) {
      this.getRecipeByCategory(this.route.snapshot.paramMap.get("id"));
    } else {
      this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
        this.allRecipe = data;
        this.allRecipe2 = data;
      });
    }

    this.filter = new FormControl("");
    this.filter$ = this.filter.valueChanges.pipe(startWith(""));
    // tslint:disable-next-line: deprecation
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$).pipe(
      map(([recipes, filterString]) => {
        return recipes.filter(
          (recipe) =>
            recipe.ingredients.filter(
              (ingredient) =>
                ingredient.nomIngredient
                  .toLowerCase()
                  .indexOf(filterString.toLowerCase()) !== -1
            ) &&
            recipe.nomRecette
              .toLowerCase()
              .indexOf(filterString.toLowerCase()) !== -1
        );
      })
    );

    if (this.auth.isLoggedIn()) {
      this.newFavori.pseudo = this.auth.getUserDetails().pseudo;
      this.getFavoris();
    }

    this.categoriesService
      .getAllCategory()
      .subscribe((categorie: CategoryDetails[]) => {
        this.categories = categorie;
        categorie.forEach((data) => {
          this.recetteService
            .getRecipeByCategory(data.idCategorie)
            .subscribe((recipes) => {
              this.recipeCategory = recipes;
              this.recipeByCategory[data.idCategorie] = this.recipeCategory;
            });
        });
      });
    this.initResearchForm();
    this.currentPage = 1;
  }

  // dans ngOnInit on récupère les données à afficher au lancement de la page
  ngOnInit(): void {}

  ngOnChanges() {
    this.allRecipe = this.allRecipe2;
    this.initResearchForm();
    document.body.scrollTop = 0;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
  }

  initResearchForm() {
    this.researchForm = this.formBuilder.group({
      filter: [""],
    });
  }

  research() {
    const formValue = this.researchForm.value;

    if (this.actualCategory != null) {
      if (formValue.filter !== "") {
        const researchResult: RecipeDetails[] = [];
        this.recipeByCategory[this.actualCategory].forEach((recipe) => {
          if (
            recipe.nomRecette
              .toLowerCase()
              .indexOf(formValue.filter.toLowerCase()) !== -1
          ) {
            if (!researchResult.includes(recipe)) {
              researchResult.push(recipe);
            }
          }
          recipe.ingredients.forEach((ingredient) => {
            if (
              ingredient.nomIngredient
                .toLowerCase()
                .indexOf(formValue.filter.toLowerCase()) !== -1
            ) {
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
      if (formValue.filter !== "") {
        const researchResult: RecipeDetails[] = [];

        this.allRecipe2.forEach((recipe) => {
          if (
            recipe.nomRecette
              .toLowerCase()
              .indexOf(formValue.filter.toLowerCase()) !== -1
          ) {
            if (!researchResult.includes(recipe)) {
              researchResult.push(recipe);
            }
          }
          recipe.ingredients.forEach((ingredient) => {
            if (
              ingredient.nomIngredient
                .toLowerCase()
                .indexOf(formValue.filter.toLowerCase()) !== -1
            ) {
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

  getAllRecipes() {
    this.actualCategory = null;

    this.recettes$ = this.recetteService.getAllRecipesAndIngredients();

    this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
      this.allRecipe = data;
    });

    this.filter = new FormControl("");
    this.filter$ = this.filter.valueChanges.pipe(startWith(""));
    // tslint:disable-next-line: deprecation
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$).pipe(
      map(([recipes, filterString]) =>
        recipes.filter(
          (recipe) =>
            recipe.nomRecette
              .toLowerCase()
              .indexOf(filterString.toLowerCase()) !== -1
        )
      )
    );
  }

  getImageByIdRecipe(id: number): any {
    this.imagesService.getImage(id).subscribe((res) => {
      return res.lienImage;
    });
  }

  getAllCategory() {
    this.categoriesService.getAllCategory().subscribe(
      (categorie: CategoryDetails[]) => {
        this.categories = categorie;
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas de catégorie.");
          }
        }
      }
    );
  }

  getRecipeByCategory(idCategorie: any) {
    this.actualCategory = idCategorie;

    this.recettes$ = this.recetteService.getRecipeByCategory(idCategorie);

    this.recetteService.getRecipeByCategory(idCategorie).subscribe((data) => {
      this.allRecipe = data;
    });

    this.filter = new FormControl("");
    this.filter$ = this.filter.valueChanges.pipe(startWith(""));
    // tslint:disable-next-line: deprecation
    this.filteredRecipe$ = combineLatest(this.recettes$, this.filter$).pipe(
      map(([recipes, filterString]) =>
        recipes.filter(
          (recipe) =>
            recipe.nomRecette
              .toLowerCase()
              .indexOf(filterString.toLowerCase()) !== -1
        )
      )
    );
  }

  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.notificationVue(recette.idRecette);
        this.router.navigate(["/recipe", recette.idRecette]).then(() => {
          window.location.reload();
        });
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Cette recette n'existe pas !");
          }
        }
      }
    );
  }

  addFavoris(id: number) {
    this.newFavori.idRecette = id;
    this.notificationFavori(this.auth.getUserDetails().pseudo,id);
    this.favorisService.addFavoris(this.newFavori).subscribe((res) => {
      this.getFavoris();
      this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
        this.allRecipe = data;
      });
    });
  }

  getFavoris() {
    this.favoris = [];
    this.favorisService.getFavoris().subscribe(
      (favoris: RecipeDetails[]) => {
        favoris.forEach((element) => {
          this.favoris.push(element.idRecette);
        });
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Cette user n'a pas de favoris");
          }
        }
      }
    );
  }

  deleteFavoris(idRecette: any) {
    this.favorisService.deleteFavoris(idRecette).subscribe((res) => {
      this.getFavoris();
      this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
        this.allRecipe = data;
      });
    }); /* rafraichit la page */
  }
   //notification vue
   notificationVue(idRecette) {
    let notif: Notification = {
      pseudo: null,
      idRecette: idRecette,
      type: "vue",
    };
    this.notifService.addNotification(notif).subscribe();
  }

    //notification favori
    notificationFavori(pseudo,idRecette) {
      let notif: Notification = {
        pseudo: pseudo,
        idRecette: idRecette,
        type: "favori",
      };
      this.notifService.addNotification(notif).subscribe();
    }
}

export interface HashTable<T> {
  [key: number]: T;
}
