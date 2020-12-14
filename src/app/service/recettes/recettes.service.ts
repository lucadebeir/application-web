import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthentificationService } from "../authentification.service";
import { addTimes, addHours } from "../../utils/Utils";
import {
  CategoryDetails,
  CreateRecipe,
  IngredientDetails,
  RecipeDetails,
} from "../../models";
import { CategoriesService } from "../categories/categories.service";
import { IngredientsService } from "../ingredients/ingredients.service";
import { ListRecipe } from "src/app/models/listRecipe.model";
import { environment } from "../../../environments/environment";

@Injectable()
export class RecettesService {
  baseUrl: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private auth: AuthentificationService,
    private ingredientService: IngredientsService,
    private categoryService: CategoriesService
  ) {}

  public getAllRecipes(): Observable<RecipeDetails[]> {
    const base = this.http.get(this.baseUrl + `/server/recipe/allRecipes`);
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
            });
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

  public getAllRecipesAsc(): Observable<RecipeDetails[]> {
    const base = this.http.get(this.baseUrl + `/server/recipe/allRecipes/asc`);
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
            });
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

  public getAllRecipesAndIngredientsDescNbVue(): Observable<RecipeDetails[]> {
    const base = this.http.get(
      this.baseUrl + `/server/recipe/allRecipes/nbVues/desc`
    );
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
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

  public getAllRecipesAndIngredients(): Observable<RecipeDetails[]> {
    const base = this.http.get(this.baseUrl + `/server/recipe/allRecipes`);
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
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

  public getRecipeById(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/server/recipe/get/" + id).pipe(
      map((element: RecipeDetails) => {
        element.nomRecette = this.decoder(element.nomRecette);
        element.mot = this.decoder(element.mot);
        element.astuce = this.decoder(element.astuce);
        element.etapes = this.decoder(element.etapes);
        this.http
          .get(this.baseUrl + `/server/image/${element.idRecette}`)
          .subscribe((data: any) => {
            element.lienImage = data[0]?.lienImage;
          });
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
        return element;
      })
    );
  }

  public getLatestReceipes(): Observable<RecipeDetails[]> {
    const base = this.http.get(this.baseUrl + `/server/recipe/latestRecipes`);
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
              element.globalTime = addHours(
                addTimes(element.tempsPreparation, element.tempsCuisson)
              );
            });
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

  public getMostPopularRecipes(): Observable<RecipeDetails[]> {
    const base = this.http.get(
      this.baseUrl + `/server/recipe/mostPopularRecipes`
    );
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
              element.globalTime = addHours(
                addTimes(element.tempsPreparation, element.tempsCuisson)
              );
            });
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

  public deleteRecipe(id: any): Observable<any> {
    const url = this.baseUrl + `/server/recipe/delete-recipe/${id}`;
    return this.http
      .delete<any>(url)
      .pipe(tap((_) => console.log(`deleted ${id}`)));
  }

  public getRecipeByCategory(idCategorie: any): Observable<RecipeDetails[]> {
    const base = this.http.get(
      this.baseUrl + `/server/recipe/category/${idCategorie}`
    );
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
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

  public getRecipeByCategoryByNbVues(
    idCategorie: any
  ): Observable<RecipeDetails[]> {
    const base = this.http.get(
      this.baseUrl + `/server/recipe/nbVues/category/${idCategorie}`
    );
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
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

  public updateNbView(recette: RecipeDetails): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + `/server/recipe/update-nbView/${recette.idRecette}`,
      recette
    );
  }

  public updateNbViewMenu(recette: RecipeDetails): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + `/server/recipeList/update-nbView/${recette.idRecette}`,
      recette
    );
  }

  public updateRecipeIng(
    recette: RecipeDetails,
    ingredient: IngredientDetails
  ): Observable<any> {
    return this.http
      .put(
        this.baseUrl + `/server/recipe/${recette.idRecette}/ingredient/update`,
        ingredient
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public createRecipe(recipe: CreateRecipe): Observable<any> {
    recipe.nomRecette = this.encoder(recipe.nomRecette);
    recipe.mot = this.encoder(recipe.mot);
    recipe.astuce = this.encoder(recipe.astuce);
    recipe.etapes = this.encoder(recipe.etapes);
    const res = this.http.post(
      this.baseUrl + "/server/recipe/add-recipe",
      recipe
    );
    return res.pipe(
      map((res) => {
        return res;
      })
    );
  }

  public addIngredientsAndCategoryToNewRecipe(
    recipe: CreateRecipe
  ): Observable<any> {
    const res = this.http.post(
      this.baseUrl + "/server/recipe/addIngredientAndCategorie",
      recipe
    );
    return res.pipe(
      map((res) => {
        return res;
      })
    );
  }

  public addRecipeCategory(
    categorie: CategoryDetails,
    recette: RecipeDetails
  ): Observable<any> {
    return this.http
      .post(
        this.baseUrl + `/server/recipe/${recette.idRecette}/category/add`,
        categorie
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getCategory(id: any): any {
    return this.http
      .get<any>(this.baseUrl + `/server/recipe/${id}/category`)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public updateRecipeName(recette: RecipeDetails): Observable<any> {
    recette.nomRecette = this.encoder(recette.nomRecette);
    return this.http
      .put(this.baseUrl + `/server/recipe/name/update`, recette)
      .pipe(
        map((data: RecipeDetails) => {
          return data;
        })
      );
  }

  public updateSteps(recette: RecipeDetails): Observable<any> {
    recette.etapes = this.encoder(recette.etapes);
    return this.http
      .put(this.baseUrl + `/server/recipe/step/update`, recette)
      .pipe(
        map((data: RecipeDetails) => {
          return data;
        })
      );
  }

  public updateAstuce(recette: RecipeDetails): Observable<any> {
    recette.astuce = this.encoder(recette.astuce);
    return this.http
      .put(this.baseUrl + `/server/recipe/astuce/update`, recette)
      .pipe(
        map((data: RecipeDetails) => {
          return data;
        })
      );
  }

  public updateDescription(recette: RecipeDetails): Observable<any> {
    recette.mot = this.encoder(recette.mot);
    return this.http
      .put(this.baseUrl + `/server/recipe/description/update`, recette)
      .pipe(
        map((data: RecipeDetails) => {
          return data;
        })
      );
  }

  public updatePart(recette: RecipeDetails): Observable<any> {
    return this.http
      .put(this.baseUrl + `/server/recipe/part/update`, recette)
      .pipe(
        map((data: RecipeDetails) => {
          return data;
        })
      );
  }

  public updateTemps(recette: RecipeDetails): Observable<any> {
    return this.http
      .put(this.baseUrl + `/server/recipe/temps/update`, recette)
      .pipe(
        map((data: RecipeDetails) => {
          return data;
        })
      );
  }

  public deleteIngredientRecipe(
    ingredient: IngredientDetails,
    recette: RecipeDetails
  ): Observable<any> {
    const url =
      this.baseUrl +
      `/server/recipe/${recette.idRecette}/ingredient/${ingredient.idIngredient}/delete`;
    return this.http
      .delete<any>(url)
      .pipe(
        tap((_) =>
          console.log(
            `deleted ${ingredient.idIngredient} from recipe ${recette.idRecette}`
          )
        )
      );
  }

  public addIngredientRecette(newIngredient: IngredientDetails): any {
    this.http
      .post(
        this.baseUrl +
          `/server/recipe/${newIngredient.idRecette}/add/ingredient/${newIngredient.idIngredient}`,
        newIngredient
      )
      .subscribe((res) => {
        {
          return res;
        }
      });
  }

  public deleteRecipeCategory(
    categorie: CategoryDetails,
    recette: RecipeDetails
  ): Observable<any> {
    const url =
      this.baseUrl +
      `/server/recipe/${recette.idRecette}/category/${categorie.idCategorie}/delete`;
    return this.http
      .delete<any>(url)
      .pipe(
        tap((_) =>
          console.log(
            `deleted ${categorie.idCategorie} from recipe ${recette.idRecette}`
          )
        )
      );
  }

  public getMenu(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/server/menu/recipe").pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getAllRecipesForMenu(): Observable<RecipeDetails[]> {
    const base = this.http.get(this.baseUrl + `/server/menu/allRecipes`);
    return base.pipe(
      map((data: RecipeDetails[]) => {
        data.forEach((element) => {
          element.nomRecette = this.decoder(element.nomRecette);
          element.mot = this.decoder(element.mot);
          element.astuce = this.decoder(element.astuce);
          element.etapes = this.decoder(element.etapes);
          this.http
            .get(this.baseUrl + `/server/image/${element.idRecette}`)
            .subscribe((data: any) => {
              element.lienImage = data[0]?.lienImage;
            });
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

  public getPetitDej(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/server/menu/petitDej").pipe(
      map((element: any) => {
        element.nomRecette = this.decoder(element.nomRecette);
        element.mot = this.decoder(element.mot);
        element.astuce = this.decoder(element.astuce);
        element.etapes = this.decoder(element.etapes);
        this.http
          .get(this.baseUrl + `/server/image/${element[0].idRecette}`)
          .subscribe((data: any) => {
            element[0].lienImage = data[0]?.lienImage;
          });
        this.categoryService
          .getCategoryByRecette(element[0].idRecette)
          .subscribe((data: any) => {
            data.forEach((categ) => {
              if (categ?.libelleCategorie === "Végétariennes") {
                element.vege = true;
              }
            });
            element[0].categories = data;
          });
        return element[0];
      })
    );
  }

  public getRepas(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/server/menu/repas").pipe(
      map((element: any) => {
        element.nomRecette = this.decoder(element.nomRecette);
        element.mot = this.decoder(element.mot);
        element.astuce = this.decoder(element.astuce);
        element.etapes = this.decoder(element.etapes);
        this.http
          .get(this.baseUrl + `/server/image/${element[0].idRecette}`)
          .subscribe((data: any) => {
            element[0].lienImage = data[0]?.lienImage;
          });
        this.categoryService
          .getCategoryByRecette(element[0].idRecette)
          .subscribe((data: any) => {
            data.forEach((categ) => {
              if (categ?.libelleCategorie === "Végétariennes") {
                element.vege = true;
              }
            });
            element[0].categories = data;
          });
        return element[0];
      })
    );
  }

  public getDouceur(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/server/menu/douceur").pipe(
      map((element: any) => {
        element.nomRecette = this.decoder(element.nomRecette);
        element.mot = this.decoder(element.mot);
        element.astuce = this.decoder(element.astuce);
        element.etapes = this.decoder(element.etapes);
        this.http
          .get(this.baseUrl + `/server/image/${element[0].idRecette}`)
          .subscribe((data: any) => {
            element[0].lienImage = data[0]?.lienImage;
          });
        this.categoryService
          .getCategoryByRecette(element[0].idRecette)
          .subscribe((data: any) => {
            data.forEach((categ) => {
              if (categ?.libelleCategorie === "Végétariennes") {
                element.vege = true;
              }
            });
            element[0].categories = data;
          });
        return element[0];
      })
    );
  }

  public updatePetitDej(petitDej: RecipeDetails): Observable<any> {
    console.log(petitDej);
    return this.http
      .post<any>(this.baseUrl + "/server/menu/petitDej/update", petitDej)
      .pipe(
        map((element: any) => {
          return element;
        })
      );
  }

  public updateRepas(repas: RecipeDetails): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/server/menu/repas/update", repas)
      .pipe(
        map((element: any) => {
          return element;
        })
      );
  }

  public updateDouceur(douceur: RecipeDetails): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/server/menu/douceur/update", douceur)
      .pipe(
        map((element: any) => {
          return element;
        })
      );
  }

  public getListRecipes(): Observable<ListRecipe[]> {
    const base = this.http.get(
      this.baseUrl + `/server/recipeList/${this.auth.getUserDetails().pseudo}`
    );
    return base.pipe(
      map((data: ListRecipe[]) => {
        data.forEach(
          (element) =>
            (element.nomRecette = decodeURIComponent(element.nomRecette))
        );
        console.log(data);
        return data;
      })
    );
  }

  public getListRecipesOfAdmin(): Observable<ListRecipe[]> {
    const base = this.http.get(this.baseUrl + `/server/recipeList/marine`);
    return base.pipe(
      map((data: ListRecipe[]) => {
        data.forEach(
          (element) =>
            (element.nomRecette = decodeURIComponent(element.nomRecette))
        );
        return data;
      })
    );
  }

  public addRecipeToList(recipe: ListRecipe): Observable<any> {
    return this.http.post(this.baseUrl + `/server/recipeList/add`, recipe).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public deleteRecipeOfList(recipe: ListRecipe): Observable<any> {
    return this.http
      .post(this.baseUrl + `/server/recipeList/delete`, recipe)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public deleteAllRecipeOfList(): Observable<any> {
    return this.http
      .post(
        this.baseUrl + `/server/recipeList/delete/all`,
        this.auth.getUserDetails().pseudo
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  //pour la recherche dynamique
  public changeStateOfRecipe(recipe: ListRecipe): Observable<any> {
    recipe.complet = !recipe.complet;
    return this.http
      .post(this.baseUrl + `/server/recipeList/update`, recipe)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  private filteredApps$: Subject<RecipeDetails[]> = new ReplaySubject<
    RecipeDetails[]
  >(1);

  getSearchResults(): Observable<RecipeDetails[]> {
    return this.filteredApps$.asObservable();
  }

  search(searchTerm: string, recipes: RecipeDetails[]): Observable<void> {
    return this.fetchApps(recipes).pipe(
      tap((apps: RecipeDetails[]) => {
        const researchResult: RecipeDetails[] = [];
        apps.forEach((recipe) => {
          if (
            recipe.nomRecette
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1
          ) {
            if (!researchResult.includes(recipe)) {
              researchResult.push(recipe);
            }
          }
          recipe.ingredients.forEach((ingredient) => {
            if (
              ingredient.nomIngredient
                .toLowerCase()
                .indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              if (!researchResult.includes(recipe)) {
                researchResult.push(recipe);
              }
            }
          });
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  private fetchApps(recipes: RecipeDetails[]): Observable<RecipeDetails[]> {
    if (recipes) {
      return of(recipes);
    }
  }

  //encoder et décoder
  private encoder(text: any) {
    let res = encodeURI(text);
    return encodeURIComponent(res);
  }

  private decoder(text: any) {
    let res = decodeURIComponent(text);
    return decodeURI(res);
  }
}
