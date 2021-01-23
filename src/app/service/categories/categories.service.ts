import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { CategoryDetails } from "src/app/models";
import { map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  baseUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  public getCategoryByRecette(idRecette: any): Observable<CategoryDetails[]> {
    const base = this.http.get(
      this.baseUrl + `/server/category/recipe/${idRecette}`
    );
    return base.pipe(
      map((data: CategoryDetails[]) => {
        return data;
      })
    );
  }

  public getAllCategory(): Observable<CategoryDetails[]> {
    return this.http.get<any>(this.baseUrl + `/server/category`).pipe(
      map((data: CategoryDetails[]) => {
        return data;
      })
    );
  }

  public deleteCategory(id: any): Observable<any> {
    const url = this.baseUrl + `/server/category/delete/${id}`;
    return this.http
      .delete<any>(url)
      .pipe(tap((_) => console.log(`deleted ${id}`)));
  }

  public updateCategory(categorie: CategoryDetails): Observable<any> {
    return this.http
      .put(this.baseUrl + `/server/category/update`, categorie)
      .pipe(
        map((data: CategoryDetails[]) => {
          return data;
        })
      );
  }

  public addCategory(categorie: CategoryDetails): any {
    this.http
      .post(this.baseUrl + "/server/category/add", categorie)
      .subscribe((res) => {
        {
          return res;
        }
      });
  }

  public getRestCategory(idRecette: any): any {
    return this.http
      .get<any>(this.baseUrl + `/server/category/rest/recipe/${idRecette}`)
      .pipe(
        map((data: CategoryDetails[]) => {
          return data;
        })
      );
  }

  private filteredApps$: Subject<CategoryDetails[]> = new ReplaySubject<
    CategoryDetails[]
  >(1);

  getSearchResults(): Observable<CategoryDetails[]> {
    return this.filteredApps$.asObservable();
  }

  search(searchTerm: string, categories: CategoryDetails[]): Observable<void> {
    return this.fetchApps(categories).pipe(
      tap((apps: CategoryDetails[]) => {
        const researchResult: CategoryDetails[] = [];
        apps.forEach((categorie) => {
          if (
            categorie.libelleCategorie
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1 &&
            !researchResult.includes(categorie)
          ) {
            researchResult.push(categorie);
          }
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  delete(categories: CategoryDetails[], idCategorie: number): Observable<void> {
    return this.fetchApps(categories).pipe(
      tap((apps: CategoryDetails[]) => {
        const researchResult: CategoryDetails[] = [];
        apps.forEach((categorie) => {
          if (categorie.idCategorie !== idCategorie) {
            if (!researchResult.includes(categorie)) {
              researchResult.push(categorie);
            }
          }
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  add(
    categories: CategoryDetails[],
    newCategorie: CategoryDetails
  ): Observable<void> {
    return this.fetchApps(categories).pipe(
      tap((apps: CategoryDetails[]) => {
        apps.push(newCategorie);
        console.log("ici");
        this.filteredApps$.next(apps);
      }),
      map(() => void 0)
    );
  }

  private fetchApps(
    categories: CategoryDetails[]
  ): Observable<CategoryDetails[]> {
    if (categories) {
      return of(categories);
    }
  }
}
