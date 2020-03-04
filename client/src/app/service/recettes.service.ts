import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { CategoriesComponent } from '../categories/categories.component'
import { CreateRecipe } from '../ajout-recette/ajout-recette.component'
import { NewIngredient } from '../modal-add-ingredient/modal-add-ingredient.component'



export interface RecipeDetails {
    idRecette: number
    nomRecette: string
    datePublication: Date
    nbFavoris: number
    nbVues: number
    etapes: Text
}

export interface IngredientDetails {
    idIngredient: string
    nomIngredient: string
    qte: number
    libelleUnite: string
}

export interface UniteDetails {
    idUnite: number
    libelleUnite: string
}

export interface QuantiteDetails {
    qte: any,
    idRecette: number
    idIngredient: number,
    idUnite: number
}

export interface CategoryDetails {
    idCategorie: number
    libelleCategorie: string
}

@Injectable()
export class RecettesService {

    constructor(private http: HttpClient) { }

    public getAllRecipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/allRecipes`)
        return base.pipe(map((data: RecipeDetails[]) => {

            return data
        }))
    }

    public getRecipeById(id: any): Observable<any> {
        return this.http.get<any>('/server/recipe/' + id)
    }

    public getIngredientsByIdRecette(id: any): any {
        return this.http.get<any>('/server/recipe/' + id + '/ingredients')
    }

    public getUtiliserIngredientsByIdRecette(id: any): Observable<QuantiteDetails[]> {
        const base = this.http.get('/server/recipe/' + id + '/utiliserIngredients')
        const utiliserIngredients = base.pipe(map((data: QuantiteDetails[]) => {
            return data
        }))
        return utiliserIngredients
    }

    public getIngredientById(idIngredient: any): Observable<IngredientDetails> {
        const base = this.http.get('/server/recipe/ingredient/' + idIngredient)
        return base.pipe(map((data: IngredientDetails) => {
            return data
        }))
    }

    public getUniteById(idUnite: any): Observable<UniteDetails> {
        const base = this.http.get('/server/recipe/unite/' + idUnite)
        return base.pipe(map((data: UniteDetails) => {
            return data
        }))
    }

    public getLatestReceipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/latestReceipes`)
        return base.pipe(map((data: RecipeDetails[]) => {
            return data
        }))
    }

    public getMostPopularRecipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/mostPopularRecipes`)
        return base.pipe(map((data: RecipeDetails[]) => {
            return data
        }))
    }

    public deleteRecipe(id: any): Observable<any> {
        const url = `/server/delete-recipe/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public getRecipeByCategory(idCategorie: any): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/recipe/category/${idCategorie}`)
        return base.pipe(map((data: RecipeDetails[]) => {
            return data
        }))
    }

    public getAllCategory(): any {
        return this.http.get<any>(`/server/category`)
            .pipe(map((data: CategoryDetails[]) => {
                return data
            }))
    }

    public updateNbView(recette: RecipeDetails): Observable<any> {
        return this.http.put<any>(`/server/recipe/update-nbView/${recette.idRecette}`, recette)
    }

    public deleteCategory(id: any): Observable<any> {
        const url = `/server/category/delete/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public updateCategory(categorie: CategoryDetails): Observable<any> {
        return this.http.put(`/server/category/update`, categorie)
            .pipe(map((data: CategoryDetails[]) => {
                return data
            }))


    }

    public addCategory(categorie: CategoryDetails): any {
        console.log(categorie)
        this.http.post('/server/category/add', categorie).subscribe(res => {
            {
                return res
            }
        })

    }

    public getAllIngredients(): any {
        return this.http.get<any>(`/server/ingredient`)
            .pipe(map((data: IngredientDetails[]) => {
                return data
            }))
    }

    public deleteIngredient(id: any): Observable<any> {
        const url = `/server/ingredient/delete/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public updateIngredient(ingredient: IngredientDetails): Observable<any> {
        return this.http.put(`/server/ingredient/update`, ingredient)
            .pipe(map((data: IngredientDetails[]) => {
                return data
            }))
    }

    public addIngredient(ingredient: any): any {
        this.http.post('/server/ingredient/add', ingredient).subscribe(res => {
            {
                return res
            }
        })

    }

    public createRecipe(recipe: CreateRecipe): Observable<any> {
        const res = this.http.post('/server/add-recipe', recipe)
        return res.pipe(map((res) => {
            return res
        }))
    }

    public addIngredientsAndCategoryToNewRecipe(recipe: CreateRecipe): Observable<any> {
        const res = this.http.post('/server/recipe/addIngredientAndCategorie', recipe)
        return res.pipe(map((res) => {
            return res
        }))
    }

    public getAllUnite(): any {
        return this.http.get<any>('/server/unite')
            .pipe(map((data: UniteDetails[]) => {
                return data
            }))
    }

    public deleteUnite(id: any): Observable<any> {
        const url = `/server/unite/delete/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public updateUnite(unite: UniteDetails): Observable<any> {
        return this.http.put(`/server/unite/update`, unite)
            .pipe(map((data: UniteDetails[]) => {
                return data
            }))
    }

    public addUnite(unite: any): any {
        this.http.post('/server/unite/add', unite).subscribe(res => {
            {
                return res
            }
        })

    }


}    