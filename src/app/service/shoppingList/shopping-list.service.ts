import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  ListeCoursesDetails,
  IngredientDetails,
  ListCourses,
} from "src/app/models";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthentificationService } from "../authentification.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ShoppingListService {
  baseUrl: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private auth: AuthentificationService
  ) {}

  public addListeCourses(newListeCourses: ListeCoursesDetails) {
    this.http
      .post(this.baseUrl + `/server/shoppingList/add`, newListeCourses)
      .subscribe((res) => {
        {
          return res;
        }
      });
  }

  public getListeCourses(): Observable<ListCourses[]> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const base = this.http.get(this.baseUrl + `/server/shoppingList/${pseudo}`);
    return base.pipe(
      map((data: ListCourses[]) => {
        console.log(data);
        return data;
      })
    );
  }

  public getRestListeCourses(): Observable<ListCourses[]> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const base = this.http.get(
      this.baseUrl + `/server/shoppingList/rest/${pseudo}`
    );
    return base.pipe(
      map((data: ListCourses[]) => {
        console.log(data);
        return data;
      })
    );
  }

  public addIngredientShoppingList(ingredient: ListCourses): Observable<any> {
    return this.http
      .post(this.baseUrl + `/server/shoppingList/add/ingredient`, ingredient)
      .pipe(
        map((res) => {
          {
            return res;
          }
        })
      );
  }

  public deleteListeCourse(id: any): Observable<any> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const url = this.baseUrl + `/server/shoppingList/delete/${id}/${pseudo}`;
    return this.http
      .delete<any>(url)
      .pipe(tap((_) => console.log(`deleted ${id}`)));
  }

  private filteredApps$: Subject<ListCourses[]> = new ReplaySubject<
    ListCourses[]
  >(1);

  getSearchResults(): Observable<ListCourses[]> {
    return this.filteredApps$.asObservable();
  }

  search(searchTerm: string, ingredients: ListCourses[]): Observable<void> {
    return this.fetchApps(ingredients).pipe(
      tap((apps: ListCourses[]) => {
        const researchResult: ListCourses[] = [];
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

  delete(ingredients: ListCourses[], nomIngredient: string): Observable<void> {
    return this.fetchApps(ingredients).pipe(
      tap((apps: ListCourses[]) => {
        const researchResult: ListCourses[] = [];
        apps.forEach((ingredient) => {
          if (ingredient.nomIngredient !== nomIngredient) {
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
    ingredients: ListCourses[],
    newIngredient: ListCourses
  ): Observable<void> {
    return this.fetchApps(ingredients).pipe(
      tap((apps: ListCourses[]) => {
        apps.push(newIngredient);
        this.filteredApps$.next(apps);
      }),
      map(() => void 0)
    );
  }

  private fetchApps(ingredients: ListCourses[]): Observable<ListCourses[]> {
    if (ingredients) {
      return of(ingredients);
    }
  }
}
