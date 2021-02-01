import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
import {
  RecettesService,
  AuthentificationService,
  CategoriesService,
  FavorisService,
} from "../../service";
import {
  RecipeDetails,
  CategoryDetails,
  FavorisDetails,
  TimeDetails,
} from "../../models";
import { HttpErrorResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FilterRecettesComponent } from "../filter-recettes/filter-recettes.component";
import { addTimes2 } from "../../utils/Utils";
import { ThemePalette } from "@angular/material/core";
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";

@Component({
  selector: "app-recettes",
  templateUrl: "./recettes.component.html",
  styleUrls: ["./recettes.component.scss"],
})
export class RecettesComponent implements OnInit, OnDestroy {
  page = 1;

  public categories: CategoryDetails[];

  public newFavori: FavorisDetails = {
    pseudo: "",
    idRecette: null,
  };
  public favoris: number[] = [];

  public allRecipe: RecipeDetails[];
  currentPage: number = JSON.parse(localStorage.getItem("value"))
    ? JSON.parse(localStorage.getItem("value")).current
    : 1;

  check: boolean = true;

  //recherche dynamique
  searchTerm = JSON.parse(localStorage.getItem("value"))
    ? JSON.parse(localStorage.getItem("value")).search
    : "";
  public recettes$: Observable<
    RecipeDetails[]
  > = this.recetteService.getSearchResults();

  //modal
  checked: boolean = JSON.parse(localStorage.getItem("value"))
    ? JSON.parse(localStorage.getItem("value")).checked
    : true;
  recent: boolean = JSON.parse(localStorage.getItem("value"))
    ? JSON.parse(localStorage.getItem("value")).recent
    : true;
  populaire: boolean = JSON.parse(localStorage.getItem("value"))
    ? JSON.parse(localStorage.getItem("value")).populaire
    : false;
  times: TimeDetails[] = JSON.parse(localStorage.getItem("value"))
    ? JSON.parse(localStorage.getItem("value")).times
    : [
        {
          libelle: "- 15min",
          filter: false,
          libNum: 15,
        },
        {
          libelle: "- 30min",
          filter: false,
          libNum: 30,
        },
        {
          libelle: "- 45min",
          filter: false,
          libNum: 45,
        },
      ];

  isLoading: boolean = true;

  //mat-spinner
  color: ThemePalette = "primary";
  mode: ProgressSpinnerMode = "indeterminate";

  constructor(
    private recetteService: RecettesService,
    private router: Router,
    public auth: AuthentificationService,
    private categoriesService: CategoriesService,
    private favorisService: FavorisService,
    private notifService: NotificationService,
    public matDialog: MatDialog,
    private route: ActivatedRoute
  ) {
    if (this.auth.isLoggedIn()) {
      this.newFavori.pseudo = this.auth.getUserDetails().pseudo;
      this.getFavoris();
    }

    setTimeout(() => {
      localStorage.removeItem("value");
      localStorage.removeItem("backButton");
    }, 1000 * 60 * 60);
  }

  // dans ngOnInit on récupère les données à afficher au lancement de la page
  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem("value"))) {
      this.isLoading = false;
      if (JSON.parse(localStorage.getItem("backButton")).backButton) {
        window.scrollTo(
          0,
          JSON.parse(localStorage.getItem("value")).windowScrollY
        );
        this.allRecipe = JSON.parse(localStorage.getItem("value")).allRecipe;
        this.categories = JSON.parse(localStorage.getItem("value")).categories;
      } else {
        this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
          this.allRecipe = data;
          this.recetteService.search(this.searchTerm, data).subscribe();
        });
        this.categoriesService
          .getAllCategory()
          .subscribe((categorie: CategoryDetails[]) => {
            categorie.forEach((data) => {
              data.checked = false;
            });
            this.categories = categorie;
          });
      }
    } else {
      this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
        this.allRecipe = data;
        this.recetteService.search(this.searchTerm, data).subscribe();
      });
      this.categoriesService
        .getAllCategory()
        .subscribe((categorie: CategoryDetails[]) => {
          categorie.forEach((data) => {
            if (this.route.snapshot.paramMap.get("id")) {
              if (
                data.idCategorie ===
                parseInt(this.route.snapshot.paramMap.get("id"), 10)
              ) {
                data.checked = true;
                this.checked = false;
              } else {
                data.checked = false;
              }
            } else {
              data.checked = false;
            }
          });
          this.categories = categorie;
        });
    }
    //console.log(JSON.parse(localStorage.getItem("value")));

    this.filterRecipes();
  }

  ngOnDestroy() {
    if (this.check) {
      localStorage.removeItem("value");
      localStorage.removeItem("backButton");
    }
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "450px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      populaire: this.populaire,
      checked: this.checked,
      times: this.times,
      categories: this.categories,
      recent: this.recent,
    };
    const modalDialog = this.matDialog.open(
      FilterRecettesComponent,
      dialogConfig
    );
    modalDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.categories = result.categories;
        this.checked = result.checked;
        this.populaire = result.populaire;
        this.recent = result.recent;
        this.times = result.times;
        this.filterRecipes();
      }
    });
  }

  filterRecipes() {
    if (this.populaire) {
      this.recetteService
        .getAllRecipesAndIngredientsDescNbVue()
        .subscribe((data) => {
          this.allRecipe = data;
          this.researchFilter(data);
          console.log(data);
        });
    } else {
      this.recetteService.getAllRecipesAndIngredients().subscribe((data) => {
        this.allRecipe = data;
        this.researchFilter(data);
      });
    }
  }

  researchFilter(data: RecipeDetails[]) {
    this.currentPage = JSON.parse(localStorage.getItem("value"))
      ? JSON.parse(localStorage.getItem("value")).current
      : 1;
    let researchResult: RecipeDetails[] = [];

    if (this.checked) {
      this.researchFilterTime(data);
    } else {
      this.categories.forEach((element) => {
        if (element.checked) {
          if (this.populaire) {
            this.recetteService
              .getRecipeByCategoryByNbVues(element.idCategorie)
              .subscribe((recipes) => {
                recipes.forEach((recipe) => {
                  if (
                    researchResult.findIndex(
                      (item) => item.idRecette === recipe.idRecette
                    ) === -1
                  ) {
                    researchResult.push(recipe);
                  }
                });
                this.researchFilterTime(researchResult);
              });
          } else {
            this.recetteService
              .getRecipeByCategory(element.idCategorie)
              .subscribe((recipes) => {
                recipes.forEach((recipe) => {
                  if (
                    researchResult.findIndex(
                      (item) => item.idRecette === recipe.idRecette
                    ) === -1
                  ) {
                    researchResult.push(recipe);
                  }
                });
                this.researchFilterTime(researchResult);
              });
          }
        }
      });
    }
  }

  researchFilterTime(data: RecipeDetails[]) {
    let researchResultFinal: RecipeDetails[] = [];

    this.times.forEach((element) => {
      if (element.filter) {
        data.forEach((recipe) => {
          if (
            addTimes2(
              recipe.tempsCuisson,
              recipe.tempsPreparation
            ).getMinutes() < element.libNum &&
            addTimes2(
              recipe.tempsCuisson,
              recipe.tempsPreparation
            ).getHours() === 0
          ) {
            researchResultFinal.push(recipe);
          }
        });
      }
    });

    if (researchResultFinal.length == 0) {
      this.allRecipe = data;

      this.recetteService
        .search(this.searchTerm, data)
        .subscribe(() => (this.isLoading = false));
    } else {
      this.allRecipe = researchResultFinal;
      this.recetteService
        .search(this.searchTerm, researchResultFinal)
        .subscribe(() => (this.isLoading = false));
    }
  }

  onSearchTermChange(): void {
    this.recetteService.search(this.searchTerm, this.allRecipe).subscribe();
    if (this.searchTerm === "") {
      this.currentPage = 1;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
  }

  updateNbView(recette: any) {
    this.check = false;
    var json = {
      windowScrollY: window.scrollY,
      current: this.currentPage,
      search: this.searchTerm,
      allRecipe: this.allRecipe,
      checked: this.checked,
      populaire: this.populaire,
      recent: this.recent,
      categories: this.categories,
      times: this.times,
    };
    localStorage.setItem("value", JSON.stringify(json));
    var json2 = {
      backButton: false,
    };
    localStorage.setItem("backButton", JSON.stringify(json2));
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        console.log(res);
        var snapshot = this.route.snapshot;
        const params = { ...snapshot.queryParams };
        delete params.pos;
        this.notificationVue(recette.idRecette);
        this.router.navigate(["/recipe", recette.idRecette]);
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
