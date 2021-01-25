import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommentaireDetails } from "src/app/models";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthentificationService } from "../authentification.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommentairesService {
  baseUrl: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private auth: AuthentificationService
  ) {}

  public addCommentaire(commentaire: CommentaireDetails): Observable<any> {
    return this.http
      .post(this.baseUrl + `/server/commentaires/add`, commentaire)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public addImageToCommentaire(
    commentaire: CommentaireDetails
  ): Observable<any> {
    return this.http
      .post<any>(
        this.baseUrl + `/server/image/commentaires/addImage`,
        commentaire
      )
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public modifyCommentaire(commentaire: CommentaireDetails): any {
    this.http
      .post<any>(this.baseUrl + `/server/commentaires/update`, commentaire)
      .subscribe((data: any) => {
        return data;
      });
  }

  public getCommentaireRecipe(id: any): Observable<any> {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return this.http
      .get<any>(this.baseUrl + `/server/commentaires/recipe/${id}`)
      .pipe(
        map((data: any) => {
          data.forEach((element) => {
            this.http
              .get(
                this.baseUrl +
                  `/server/image/commentaire/${element.idCommentaire}`
              )
              .subscribe((data: any) => {
                element.lienImage = data[0]?.lienImage;
              });

            const d = new Date(element.dateCommentaire);

            element.dateCommentaire = d.toLocaleString("FR-fr", options);

            this.auth.getUser(element.ecritPar).subscribe((data) => {
              element.admin = data.admin;
            });
            let element2 = element;
            let bool = true;

            while (bool) {
              this.getReponseCommentaireRecipe(
                id,
                element.idCommentaire
              ).subscribe((commentaire) => {
                element.children = commentaire;
              });
              if (element2.children) {
                element2 = element2.children;
              } else {
                bool = false;
              }
            }
          });
          return data;
        })
      );
  }

  public getReponseCommentaireRecipe(
    id: any,
    idCommentaire: any
  ): Observable<any> {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return this.http
      .get<any>(
        this.baseUrl +
          `/server/commentaires/recipe/${id}/reponse/${idCommentaire}`
      )
      .pipe(
        map((commentaire: any) => {
          commentaire.forEach((element) => {
            this.http
              .get(
                this.baseUrl +
                  `/server/image/commentaire/${element.idCommentaire}`
              )
              .subscribe((data: any) => {
                element.lienImage = data[0]?.lienImage;
              });

            const d = new Date(element.dateCommentaire);

            element.dateCommentaire = d.toLocaleString("FR-fr", options);

            this.auth.getUser(element.ecritPar).subscribe((data) => {
              element.admin = data.admin;
            });
            this.getReponseCommentaireRecipe(
              id,
              element.idCommentaire
            ).subscribe((commentaire) => {
              element.children = commentaire;
            });
          });
          return commentaire;
        })
      );
  }

  public deleteCommentaire(id: any): Observable<any> {
    const url = this.baseUrl + `/server/commentaires/commentaire/${id}/delete`;
    return this.http
      .delete<any>(url)
      .pipe(tap((_) => console.log(`deleted ${id}`)));
  }

  public getCommentaireUser(pseudo: any): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + `/server/commentaires/${pseudo}/mescommentaires`)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  private filteredApps$: Subject<CommentaireDetails[]> = new ReplaySubject<
    CommentaireDetails[]
  >(1);

  getSearchResults(): Observable<CommentaireDetails[]> {
    return this.filteredApps$.asObservable();
  }

  search(commentaires: CommentaireDetails[]): Observable<void> {
    return this.fetchApps(commentaires).pipe(
      tap((apps: CommentaireDetails[]) => {
        const researchResult: CommentaireDetails[] = [];
        apps.forEach((commentaire) => {
          researchResult.push(commentaire);
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  delete(
    commentaires: CommentaireDetails[],
    idCommentaire: number
  ): Observable<void> {
    return this.fetchApps(commentaires).pipe(
      tap((apps: CommentaireDetails[]) => {
        const researchResult: CommentaireDetails[] = [];
        apps.forEach((commentaire) => {
          if (commentaire.idCommentaire !== idCommentaire) {
            if (!researchResult.includes(commentaire)) {
              researchResult.push(commentaire);
            }
          }
        });
        this.filteredApps$.next(researchResult);
      }),
      map(() => void 0)
    );
  }

  add(
    commentaires: CommentaireDetails[],
    newCommentaire: CommentaireDetails
  ): Observable<void> {
    return this.fetchApps(commentaires).pipe(
      tap((apps: CommentaireDetails[]) => {
        apps.push(newCommentaire);
        this.filteredApps$.next(apps);
      }),
      map(() => void 0)
    );
  }

  private fetchApps(
    ingredients: CommentaireDetails[]
  ): Observable<CommentaireDetails[]> {
    if (ingredients) {
      return of(ingredients);
    }
  }
}
