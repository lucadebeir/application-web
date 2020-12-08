import { Component, OnInit, OnChanges } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import {
  RecettesService,
  AuthentificationService,
  FavorisService,
  CategoriesService,
} from "../../service";
import { RecipeDetails, CategoryDetails } from "../../models";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { HashTable } from "../recettes/recettes.component";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";

@Component({
  selector: "app-mes-recettes",
  templateUrl: "./mes-recettes.component.html",
  styleUrls: ["./mes-recettes.component.scss"],
})
export class MesRecettesComponent implements OnInit {
  page = 1;

  public actualCategory: number = null;
  public recipeByCategory: HashTable<RecipeDetails[]> = {};
  public recipeCategory: RecipeDetails[] = [];

  public allRecipe: RecipeDetails[];

  public categories: CategoryDetails[];

  //recherche dynamique
  searchTerm = "";
  public recettes$: Observable<
    RecipeDetails[]
  > = this.recetteService.getSearchResults();

  constructor(
    private recetteService: RecettesService,
    private router: Router,
    public auth: AuthentificationService,
    private favorisService: FavorisService,
    private categoriesService: CategoriesService,
    private notifService: NotificationService
  ) {
    this.favorisService.getFavoris().subscribe((data) => {
      this.allRecipe = data;
      console.log(data);
      this.recetteService.search(this.searchTerm, data).subscribe();
    });

    this.categoriesService
      .getAllCategory()
      .subscribe((categorie: CategoryDetails[]) => {
        categorie.forEach((data) => {
          this.favorisService
            .getFavorisByCategory(data.idCategorie)
            .subscribe((recipes) => {
              this.recipeCategory = recipes;
              this.recipeByCategory[data.idCategorie] = this.recipeCategory;
            });
        });
        this.categories = categorie;
      });
  }

  ngOnInit(): void {}

  onSearchTermChange(): void {
    this.recetteService.search(this.searchTerm, this.allRecipe).subscribe();
  }

  getFavoris() {
    this.favorisService.getFavoris().subscribe((data) => {
      this.allRecipe = data;
      this.recetteService.search(this.searchTerm, data).subscribe();
    });
  }

  getFavorisByCategory(idCategorie: any) {
    this.actualCategory = idCategorie;

    this.favorisService.getFavorisByCategory(idCategorie).subscribe((data) => {
      this.allRecipe = data;
      this.recetteService.search(this.searchTerm, data).subscribe();
    });
  }

  // voir si on peut la récupérer au lieu de la recopier!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

  deleteFavoris(idRecette: any) {
    this.favorisService.deleteFavoris(idRecette).subscribe(
      (res) => {
        this.router.navigate(["/favorites"], {
          queryParams: { refresh: new Date().getTime() },
        });
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
  //notification vue
  notificationVue(idRecette) {
    let notif: Notification = {
      pseudo: null,
      idRecette: idRecette,
      type: "vue",
    };
    this.notifService.addNotification(notif).subscribe();
  }
}
