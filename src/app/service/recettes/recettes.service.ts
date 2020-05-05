import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthentificationService } from '../authentification.service';
import { addTimes, addHours } from '../../utils/Utils';
import {
    CategoryDetails, CreateRecipe,
    IngredientDetails, RecipeDetails
} from '../../models';
import { CategoriesService } from '../categories/categories.service';
import { IngredientsService } from '../ingredients/ingredients.service';

@Injectable()
export class RecettesService {

    constructor(private http: HttpClient, private auth: AuthentificationService, private ingredientService: IngredientsService,
                private categoryService: CategoriesService) { }

    public getAllRecipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/recipe/allRecipes`);
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage;
                });
                this.categoryService.getCategoryByRecette(element.idRecette).subscribe((data: any) => {
                    element.categories = data;
                });
            });
            return data;
        }));
    }

    public getAllRecipesAndIngredients(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/recipe/allRecipes`);
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage;
                });

                element.ingredients = [];
                this.ingredientService.getIngredientsByIdRecette(element.idRecette).subscribe(data => {
                    element.ingredients = data;
                });
                element.globalTime = addHours(addTimes(element.tempsPreparation, element.tempsCuisson));
                this.categoryService.getCategoryByRecette(element.idRecette).subscribe((data: any) => {
                    element.categories = data;
                });
            });
            return data;
        }));
    }

    public getRecipeById(id: any): Observable<any> {
        return this.http.get<any>('/server/recipe/get/' + id);
    }

    public getLatestReceipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/recipe/latestRecipes`);
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage;
                    element.globalTime = addHours(addTimes(element.tempsPreparation, element.tempsCuisson));
                });
                this.categoryService.getCategoryByRecette(element.idRecette).subscribe((data: any) => {
                    element.categories = data;
                });
            });
            return data;
        }));
    }

    public getMostPopularRecipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/recipe/mostPopularRecipes`);
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage;
                    element.globalTime = addHours(addTimes(element.tempsPreparation, element.tempsCuisson));
                });
                this.categoryService.getCategoryByRecette(element.idRecette).subscribe((data: any) => {
                    element.categories = data;
                });
            });
            return data;
        }));
    }

    public deleteRecipe(id: any): Observable<any> {
        const url = `/server/recipe/delete-recipe/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public getRecipeByCategory(idCategorie: any): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/recipe/category/${idCategorie}`);
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage;
                });
                this.ingredientService.getIngredientsByIdRecette(element.idRecette).subscribe(data => {
                    element.ingredients = data;
                });
                element.globalTime = addHours(addTimes(element.tempsCuisson, element.tempsPreparation));
            });
            return data;
        }));
    }

    public updateNbView(recette: RecipeDetails): Observable<any> {
        return this.http.put<any>(`/server/recipe/update-nbView/${recette.idRecette}`, recette);
    }

    public updateRecipeIng(recette: RecipeDetails, ingredient: IngredientDetails): Observable<any> {
        return this.http.put(`/server/recipe/${recette.idRecette}/ingredient/update`, ingredient)
            .pipe(map((res) => {
                return res;
            }));
    }

    public createRecipe(recipe: CreateRecipe): Observable<any> {
        const res = this.http.post('/server/recipe/add-recipe', recipe);
        return res.pipe(map((res) => {
            return res;
        }));
    }

    public addIngredientsAndCategoryToNewRecipe(recipe: CreateRecipe): Observable<any> {
        const res = this.http.post('/server/recipe/addIngredientAndCategorie', recipe);
        return res.pipe(map((res) => {
            return res;
        }));
    }

    public addRecipeCategory(categorie: CategoryDetails, recette: RecipeDetails): Observable<any> {
        return this.http.post(`/server/recipe/${recette.idRecette}/category/add`, categorie)
            .pipe(map((res) => {
                return res;
            }));
    }

    public getCategory(id: any): any {
        return this.http.get<any>(`/server/recipe/${id}/category`)
            .pipe(map((data: any) => {
                return data;
            }));
    }

    public updateRecipeName(recette: RecipeDetails): Observable<any> {

        return this.http.put(`/server/recipe/name/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data;
            }));


    }

    public updateSteps(recette: RecipeDetails): Observable<any> {

        return this.http.put(`/server/recipe/step/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data;
            }));


    }

    public updateAstuce(recette: RecipeDetails): Observable<any> {
        return this.http.put(`/server/recipe/astuce/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data;
            }));
    }

    public updatePart(recette: RecipeDetails): Observable<any> {
        return this.http.put(`/server/recipe/part/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data;
            }));
    }

    public updateTemps(recette: RecipeDetails): Observable<any> {
        return this.http.put(`/server/recipe/temps/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data;
            }));
    }

    public deleteIngredientRecipe(ingredient: IngredientDetails, recette: RecipeDetails): Observable<any> {
        const url = `/server/recipe/${recette.idRecette}/ingredient/${ingredient.idIngredient}/delete`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${ingredient.idIngredient} from recipe ${recette.idRecette}`)),
        );
    }

    public addIngredientRecette(newIngredient: IngredientDetails): any {
        this.http.post(`/server/recipe/${newIngredient.idRecette}/add/ingredient/${newIngredient.idIngredient}`, newIngredient)
            .subscribe(res => {
                {
                    return res;
                }
            });
    }

    public deleteRecipeCategory(categorie: CategoryDetails, recette: RecipeDetails): Observable<any> {
        const url = `/server/recipe/${recette.idRecette}/category/${categorie.idCategorie}/delete`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${categorie.idCategorie} from recipe ${recette.idRecette}`)),
        );
    }

    public getMenu(): Observable<any> {
        return this.http.get<any>('/server/menu/recipe')
            .pipe(map((data: any) => {
                return data;
            }));
    }

    public getPetitDej(): Observable<any> {
        return this.http.get<any>('/server/menu/petitDej')
            .pipe(map((element: any) => {
                this.http.get(`/server/image/${element[0].idRecette}`).subscribe((data: any) => {
                    element[0].lienImage = data[0]?.lienImage;
                });
                this.categoryService.getCategoryByRecette(element[0].idRecette).subscribe((data: any) => {
                    element[0].categories = data;
                });
                return element[0];
            }));
    }

    public getRepas(): Observable<any> {
        return this.http.get<any>('/server/menu/repas')
            .pipe(map((element: any) => {
                this.http.get(`/server/image/${element[0].idRecette}`).subscribe((data: any) => {
                    element[0].lienImage = data[0]?.lienImage;
                });
                this.categoryService.getCategoryByRecette(element[0].idRecette).subscribe((data: any) => {
                    element[0].categories = data;
                });
                return element[0];
            }));
    }

    public getDouceur(): Observable<any> {
        return this.http.get<any>('/server/menu/douceur')
            .pipe(map((element: any) => {
                this.http.get(`/server/image/${element[0].idRecette}`).subscribe((data: any) => {
                    element[0].lienImage = data[0]?.lienImage;
                });
                this.categoryService.getCategoryByRecette(element[0].idRecette).subscribe((data: any) => {
                    element[0].categories = data;
                });
                return element[0];
            }));
    }

}
