import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  RecettesService,
  AuthentificationService,
  FavorisService,
  CategoriesService,
} from "../../service";
import { RecipeDetails, CategoryDetails, TimeDetails } from "../../models";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { addTimes2 } from "../../utils/Utils";
import { FilterRecettesComponent } from "../filter-recettes/filter-recettes.component";

@Component({
  selector: "app-mes-recettes",
  templateUrl: "./mes-recettes.component.html",
  styleUrls: ["./mes-recettes.component.scss"],
})
export class MesRecettesComponent implements OnInit {
  page = 1;

  public allRecipe: RecipeDetails[];

  public categories: CategoryDetails[];

  isLoading: boolean = true;

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

  constructor(
    private recetteService: RecettesService,
    private router: Router,
    public auth: AuthentificationService,
    private favorisService: FavorisService,
    private categoriesService: CategoriesService,
    private notifService: NotificationService,
    public matDialog: MatDialog
  ) {
    setTimeout(() => {
      localStorage.removeItem("value");
      localStorage.removeItem("backButton");
    }, 1000 * 60 * 60);
  }

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
      this.favorisService.getFavoris().subscribe((data) => {
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
      this.favorisService.getFavorisNbVues().subscribe((data) => {
        this.allRecipe = data;
        this.researchFilter(data);
      });
    } else {
      this.favorisService.getFavoris().subscribe((data) => {
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
    let researchResultFinal: RecipeDetails[] = [];

    if (this.checked) {
      researchResult = data;
      this.isLoading = true;
    } else {
      this.categories.forEach((element) => {
        if (element.checked) {
          if (this.populaire) {
            this.favorisService
              .getFavorisByCategoryByNbVues(element.idCategorie)
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
              });
          } else {
            this.favorisService
              .getFavorisByCategory(element.idCategorie)
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
              });
          }
        }
      });
    }

    this.times.forEach((element) => {
      if (element.filter) {
        researchResult.forEach((recipe) => {
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
      this.allRecipe = researchResult;
      this.recetteService
        .search(this.searchTerm, researchResult)
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

  // REVOIR CETTE FONCTION CAR ON UPDATE PAS ICI LE NB DE VUES!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

    this.router.navigate(["/recipe", recette.idRecette]);
  }

  deleteFavoris(idRecette: any) {
    this.favorisService.deleteFavoris(idRecette).subscribe(
      (res) => {
        this.router.navigate(["/favorites"]);
      },
      (err) => {
        console.log(err);
      }
    );
    this.favorisService.getFavoris().subscribe((data) => {
      this.allRecipe = data;
      this.recetteService.search(this.searchTerm, data).subscribe();
    }); /* rafraichit la page */
  }

  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
  }
}
