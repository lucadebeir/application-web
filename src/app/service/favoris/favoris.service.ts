import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FavorisDetails, RecipeDetails } from "src/app/models";
import { Observable } from "rxjs";
import { IngredientsService } from "../ingredients/ingredients.service";
import { map } from "rxjs/operators";
import { AuthentificationService } from "../authentification.service";
import { addTimes, addHours } from "../../utils/Utils";
import { CategoriesService } from "../categories/categories.service";

@Injectable({
  providedIn: "root",
})
export class FavorisService {
  constructor(
    private http: HttpClient,
    private ingredientService: IngredientsService,
    private auth: AuthentificationService,
    private categoryService: CategoriesService
  ) {}

  public addFavoris(newFavori: FavorisDetails): Observable<any> {
    return this.http.post(`/server/favorites/add`, newFavori).pipe((res) => {
      return res;
    });
  }

  public getFavoris(): Observable<RecipeDetails[]> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const base = this.http.get(`/server/favorites/recipe/${pseudo}`);
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = decodeURIComponent(element.nomRecette);
          this.http
            .get(`/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
            });
          element.ingredients = [];
          this.ingredientService
            .getIngredientsByIdRecette(element.idRecette)
            .subscribe((data) => {
              element.ingredients = data;
            });
          element.globalTime = addHours(
            addTimes(element.tempsPreparation, element.tempsCuisson)
          );
          this.categoryService
            .getCategoryByRecette(element.idRecette)
            .subscribe((data: any) => {
              data.forEach((categ) => {
                if (categ?.libelleCategorie === "Végétariennes") {
                  element.vege = true;
                }
              });
              element.categories = data;
            });
        });
        return data;
      })
    );
  }

  public getFavorisNbVues(): Observable<RecipeDetails[]> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const base = this.http.get(`/server/favorites/recipe/nbVues/${pseudo}`);
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = decodeURIComponent(element.nomRecette);
          this.http
            .get(`/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
            });
          element.ingredients = [];
          this.ingredientService
            .getIngredientsByIdRecette(element.idRecette)
            .subscribe((data) => {
              element.ingredients = data;
            });
          element.globalTime = addHours(
            addTimes(element.tempsPreparation, element.tempsCuisson)
          );
          this.categoryService
            .getCategoryByRecette(element.idRecette)
            .subscribe((data: any) => {
              data.forEach((categ) => {
                if (categ?.libelleCategorie === "Végétariennes") {
                  element.vege = true;
                }
              });
              element.categories = data;
            });
        });
        return data;
      })
    );
  }

  public getFavorisByCategory(
    idCategorie: number
  ): Observable<RecipeDetails[]> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const base = this.http.get(
      `/server/favorites/recipe/${pseudo}/${idCategorie}`
    );
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = decodeURIComponent(element.nomRecette);
          this.http
            .get(`/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
            });
          element.ingredients = [];
          this.ingredientService
            .getIngredientsByIdRecette(element.idRecette)
            .subscribe((data) => {
              element.ingredients = data;
            });
          element.globalTime = addHours(
            addTimes(element.tempsPreparation, element.tempsCuisson)
          );
          this.categoryService
            .getCategoryByRecette(element.idRecette)
            .subscribe((data: any) => {
              data.forEach((categ) => {
                if (categ?.libelleCategorie === "Végétariennes") {
                  element.vege = true;
                }
              });
              element.categories = data;
            });
        });
        return data;
      })
    );
  }

  public getFavorisByCategoryByNbVues(
    idCategorie: number
  ): Observable<RecipeDetails[]> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const base = this.http.get(
      `/server/favorites/recipe/nbVues/${pseudo}/${idCategorie}`
    );
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = decodeURIComponent(element.nomRecette);
          this.http
            .get(`/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
            });
          element.ingredients = [];
          this.ingredientService
            .getIngredientsByIdRecette(element.idRecette)
            .subscribe((data) => {
              element.ingredients = data;
            });
          element.globalTime = addHours(
            addTimes(element.tempsPreparation, element.tempsCuisson)
          );
          this.categoryService
            .getCategoryByRecette(element.idRecette)
            .subscribe((data: any) => {
              data.forEach((categ) => {
                if (categ?.libelleCategorie === "Végétariennes") {
                  element.vege = true;
                }
              });
              element.categories = data;
            });
        });
        return data;
      })
    );
  }

  public deleteFavoris(id: any): Observable<any> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const url = `/server/favorites/${pseudo}/delete/${id}`;
    return this.http.delete<any>(url).pipe((res) => {
      return res;
    });
  }
}
