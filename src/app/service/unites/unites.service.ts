import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { UniteDetails } from "src/app/models";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UnitesService {
  baseUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  public getAllUnite(): Observable<UniteDetails[]> {
    return this.http.get<any>(this.baseUrl + "/server/unite").pipe(
      map((data: UniteDetails[]) => {
        return data;
      })
    );
  }

  public deleteUnite(id: any): Observable<any> {
    const url = this.baseUrl + `/server/unite/delete/${id}`;
    return this.http
      .delete<any>(url)
      .pipe(tap((_) => console.log(`deleted ${id}`)));
  }

  public updateUnite(unite: UniteDetails): Observable<any> {
    unite.libelleUnite = unite.libelleUnite.trim();
    return this.http.put(this.baseUrl + `/server/unite/update`, unite).pipe(
      map((data: UniteDetails[]) => {
        return data;
      })
    );
  }

  public addUnite(unite: any): any {
    unite.libelleUnite = unite.libelleUnite.trim();
    this.http
      .post(this.baseUrl + "/server/unite/add", unite)
      .subscribe((res) => {
        {
          return res;
        }
      });
  }

  public getUniteById(idUnite: any): Observable<UniteDetails> {
    const base = this.http.get(
      this.baseUrl + "/server/recipe/unite/" + idUnite
    );
    return base.pipe(
      map((data: UniteDetails) => {
        return data;
      })
    );
  }

  private filteredApps$: Subject<UniteDetails[]> = new ReplaySubject<
    UniteDetails[]
  >(1);

  getSearchResults(): Observable<UniteDetails[]> {
    return this.filteredApps$.asObservable();
  }

  search(searchTerm: string, unites: UniteDetails[]): Observable<void> {
    return this.fetchApps(unites).pipe(
      tap((apps: UniteDetails[]) => {
        const researchResult: UniteDetails[] = [];
        apps.forEach((unite) => {
          if (
            unite.libelleUnite
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1
          ) {
            if (!researchResult.includes(unite)) {
              researchResult.push(unite);
            }
          }
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  delete(unites: UniteDetails[], idUnite: number): Observable<void> {
    return this.fetchApps(unites).pipe(
      tap((apps: UniteDetails[]) => {
        const researchResult: UniteDetails[] = [];
        apps.forEach((unite) => {
          if (unite.idUnite !== idUnite) {
            if (!researchResult.includes(unite)) {
              researchResult.push(unite);
            }
          }
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  add(unites: UniteDetails[], newUnite: UniteDetails): Observable<void> {
    return this.fetchApps(unites).pipe(
      tap((apps: UniteDetails[]) => {
        apps.push(newUnite);
        this.filteredApps$.next(apps);
      }),
      map(() => void 0)
    );
  }

  private fetchApps(unites: UniteDetails[]): Observable<UniteDetails[]> {
    if (unites) {
      return of(unites);
    }
  }
}
