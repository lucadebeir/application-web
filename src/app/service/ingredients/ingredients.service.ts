import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QuantiteDetails, IngredientDetails } from 'src/app/models';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private http: HttpClient) { }

  public getIngredientsByIdRecette(id: any): any {
    return this.http.get<any>('/server/recipe/' + id + '/ingredients');
  }

  public getUtiliserIngredientsByIdRecette(id: any): Observable<QuantiteDetails[]> {
    const base = this.http.get('/server/recipe/' + id + '/utiliserIngredients');
    const utiliserIngredients = base.pipe(map((data: QuantiteDetails[]) => {
      return data;
    }));
    return utiliserIngredients;
  }

  public getIngredientById(idIngredient: any): Observable<IngredientDetails> {
    const base = this.http.get('/server/ingredient/' + idIngredient);
    return base.pipe(map((data: IngredientDetails) => {
      return data;
    }));
  }

  public getAllIngredients(): Observable<IngredientDetails[]> {
    return this.http.get<any>(`/server/ingredient`)
      .pipe(map((data: IngredientDetails[]) => {
        return data;
      }));
  }

  public getRestIngredients(idRecette: any): any {
    return this.http.get<any>(`/server/ingredient/recipe/${idRecette}/rest`)
      .pipe(map((data: IngredientDetails[]) => {
        return data;
      }));
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
        return data;
      }));
  }

  public addIngredient(ingredient: any): any {
    this.http.post('/server/ingredient/add', ingredient).subscribe(res => {
      {
        return res;
      }
    });
  }

  public getRestOfIngredients(ingredients: number[]): any {
    let params = new HttpParams();

    ingredients.forEach((idIngredient: number) => {
        params = params.append(`ingredients[]`, idIngredient.toString());
    });
    return this.http.get<any>(`/server/ingredient/rest`, { params })
        .pipe(map((data: IngredientDetails[]) => {
            return data;
        }));
}
}
