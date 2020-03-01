import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Observable, of} from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
 


export interface RecipeDetails {
    idRecette: number
    nomRecette: string
    datePublication: Date
    nbFavoris: number
    nbVues: number
    etapes: Text
}

export interface IngredientDetails {
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

    constructor(private http: HttpClient){ }

    public getAllRecipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/allRecipes`)
        return base.pipe(map((data: RecipeDetails[]) => {
                console.log(data)
                return data
            }))
    }

    public getRecipeById(id: any) : Observable<any> {
        return this.http.get<any>('/server/recipe/' + id)
    }

    public getIngredientsByIdRecette(id: any) : any {
        return this.http.get<any>('/server/recipe/' + id + '/ingredients')
    }

    public getUtiliserIngredientsByIdRecette(id: any) : Observable<QuantiteDetails[]> {
        const base = this.http.get('/server/recipe/' + id + '/utiliserIngredients')
        const utiliserIngredients = base.pipe(map((data: QuantiteDetails[]) => {
            return data
        }))
        console.log("ohohoho")
        console.log(utiliserIngredients)
        return utiliserIngredients
    }

    public getIngredientById(idIngredient: any) : Observable<IngredientDetails> {
        const base = this.http.get('/server/recipe/ingredient/' + idIngredient)
        return base.pipe(map((data: IngredientDetails) => {
            return data
        }))
    }

    public getUniteById(idUnite: any) : Observable<UniteDetails> {
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

    public getMostPopularRecipes():Observable<RecipeDetails[]> {
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

    public getRecipeByCategory(idCategorie: any):Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/recipe/category/${idCategorie}`)
        return base.pipe(map((data: RecipeDetails[]) => {
            return data
        }))
    }

    public getAllCategory(): any {
        return this.http.get<any>(`/server/category`)
    }

    public updateNbView(idRecette: number): Observable<any> {
        return this.http.put(`/server/recipe/update-nbView/${idRecette}`, idRecette)
    }

}    