import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Observable, of} from 'rxjs'
import { Router } from '@angular/router'


export interface RecipeDetails {
    idRecette: number
    nomRecette: string
    datePublication: Date
    nbFavoris: number
    nbVues: number
    etapes: Text
}

@Injectable()
export class RecettesService {

    constructor(private http: HttpClient){ }

    public getAllRecipes(): Observable<any> {
        return this.http.get<any>('/recipes/allRecipes')
    }

}    