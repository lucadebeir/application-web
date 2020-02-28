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

@Injectable()
export class RecettesService {

    constructor(private http: HttpClient){ }

    public getAllRecipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/allRecipes`)
        return base.pipe(map((data: RecipeDetails[]) => {
                console.log(data)
                return data
            }))
    }

}    