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
export class RecettesComponent implements OnInit {
  page = 1;

  public actualCategory: number = null;
  public recipeByCategory: HashTable<RecipeDetails[]> = {};
  public recipeCategory: RecipeDetails[] = [];

  public categories: CategoryDetails[];

  public newFavori: FavorisDetails = {
    pseudo: "",
    idRecette: null,
  };
  public favoris: number[] = [];

  public allRecipe: RecipeDetails[];
  currentPage: number;

  //recherche dynamique
  searchTerm = "";
  public recettes$: Observable<
    RecipeDetails[]
  > = this.recetteService.getSearchResults();

  constructor(
    private recetteService: RecettesService,
    private router: Router,
    public auth: AuthentificationService,
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    private categoriesService: CategoriesService,
    private favorisService: FavorisService,
    private notifService: NotificationService
  ) {
    if (this.route.snapshot.paramMap.get("id")) {
      this.getRecipeByCategory(this.route.snapshot.paramMap.get("id"));
    } else {
      this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
        this.allRecipe = data;
        this.recetteService.search(this.searchTerm, data).subscribe();
      });
    }

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
    this.currentPage = 1;
  }

  // dans ngOnInit on récupère les données à afficher au lancement de la page
  ngOnInit(): void {}

  onSearchTermChange(): void {
    this.recetteService.search(this.searchTerm, this.allRecipe).subscribe();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
  }

  getAllRecipes() {
    this.actualCategory = null;

    this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
      this.allRecipe = data;
      this.recetteService.search(this.searchTerm, data).subscribe();
    });
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

    this.recetteService.getRecipeByCategory(idCategorie).subscribe((data) => {
      console.log(data);
      this.allRecipe = data;
      this.recetteService.search(this.searchTerm, data).subscribe();
    });
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
    this.notificationFavori(this.auth.getUserDetails().pseudo, id);
    this.favorisService.addFavoris(this.newFavori).subscribe((res) => {
      this.getFavoris();
      this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
        this.allRecipe = data;
        this.recetteService.search(this.searchTerm, data).subscribe();
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
        this.recetteService.search(this.searchTerm, data).subscribe();
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
  notificationFavori(pseudo, idRecette) {
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
