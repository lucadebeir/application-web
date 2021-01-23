import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { QuantiteDetails, IngredientDetails } from "src/app/models";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class IngredientsService {
  baseUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  public getIngredientsByIdRecette(id: any): any {
    return this.http.get<any>(
      this.baseUrl + "/server/recipe/" + id + "/ingredients"
    );
  }

  public getUtiliserIngredientsByIdRecette(
    id: any
  ): Observable<QuantiteDetails[]> {
    const base = this.http.get(
      this.baseUrl + "/server/recipe/" + id + "/utiliserIngredients"
    );
    const utiliserIngredients = base.pipe(
      map((data: QuantiteDetails[]) => {
        return data;
      })
    );
    return utiliserIngredients;
  }

  public getIngredientById(idIngredient: any): Observable<IngredientDetails> {
    const base = this.http.get(
      this.baseUrl + "/server/ingredient/" + idIngredient
    );
    return base.pipe(
      map((data: IngredientDetails) => {
        return data;
      })
    );
  }

  public getAllIngredients(): Observable<IngredientDetails[]> {
    return this.http.get<any>(this.baseUrl + `/server/ingredient`).pipe(
      map((data: IngredientDetails[]) => {
        return data;
      })
    );
  }

  public getRestIngredients(idRecette: any): any {
    return this.http
      .get<any>(this.baseUrl + `/server/ingredient/recipe/${idRecette}/rest`)
      .pipe(
        map((data: IngredientDetails[]) => {
          return data;
        })
      );
  }

  public deleteIngredient(id: any): Observable<any> {
    const url = this.baseUrl + `/server/ingredient/delete/${id}`;
    return this.http
      .delete<any>(url)
      .pipe(tap((_) => console.log(`deleted ${id}`)));
  }

  public updateIngredient(ingredient: IngredientDetails): Observable<any> {
    ingredient.nomIngredient = ingredient.nomIngredient.trim();
    return this.http
      .put(this.baseUrl + `/server/ingredient/update`, ingredient)
      .pipe(
        map((data: IngredientDetails[]) => {
          return data;
        })
      );
  }

  public addIngredient(ingredient: any): any {
    ingredient.nomIngredient = ingredient.nomIngredient.trim();
    this.http
      .post(this.baseUrl + "/server/ingredient/add", ingredient)
      .subscribe((res) => {
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
    return this.http
      .get<any>(this.baseUrl + `/server/ingredient/rest`, { params })
      .pipe(
        map((data: IngredientDetails[]) => {
          return data;
        })
      );
  }

  private filteredApps$: Subject<IngredientDetails[]> = new ReplaySubject<
    IngredientDetails[]
  >(1);

  getSearchResults(): Observable<IngredientDetails[]> {
    return this.filteredApps$.asObservable();
  }

  search(
    searchTerm: string,
    ingredients: IngredientDetails[]
  ): Observable<void> {
    return this.fetchApps(ingredients).pipe(
      tap((apps: IngredientDetails[]) => {
        const researchResult: IngredientDetails[] = [];
        apps.forEach((ingredient) => {
          if (
            ingredient.nomIngredient
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1
          ) {
            if (!researchResult.includes(ingredient)) {
              researchResult.push(ingredient);
            }
          }
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  delete(
    ingredients: IngredientDetails[],
    idIngredient: number
  ): Observable<void> {
    return this.fetchApps(ingredients).pipe(
      tap((apps: IngredientDetails[]) => {
        const researchResult: IngredientDetails[] = [];
        apps.forEach((ingredient) => {
          if (ingredient.idIngredient !== idIngredient) {
            if (!researchResult.includes(ingredient)) {
              researchResult.push(ingredient);
            }
          }
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  add(
    ingredients: IngredientDetails[],
    newIngredient: IngredientDetails
  ): Observable<void> {
    return this.fetchApps(ingredients).pipe(
      tap((apps: IngredientDetails[]) => {
        apps.push(newIngredient);
        this.filteredApps$.next(apps);
      }),
      map(() => void 0)
    );
  }

  private fetchApps(
    ingredients: IngredientDetails[]
  ): Observable<IngredientDetails[]> {
    if (ingredients) {
      return of(ingredients);
    }
  }
}
