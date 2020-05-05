import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommentaireDetails } from 'src/app/models';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthentificationService } from '../authentification.service';

@Injectable({
  providedIn: 'root'
})
export class CommentairesService {

  constructor(private http: HttpClient, private auth: AuthentificationService) { }

  public addCommentaire(commentaire: CommentaireDetails): Observable<any> {
    return this.http.post(`/server/commentaires/add`, commentaire)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  public addImageToCommentaire(commentaire: CommentaireDetails): Observable<any> {
    return this.http.post<any>(`/server/image/commentaires/addImage`, commentaire)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  public modifyCommentaire(commentaire: CommentaireDetails): any {
    this.http.post<any>(`/server/commentaires/update`, commentaire)
      .subscribe((data: any) => {
        return data;
      });
  }

  public getCommentaireRecipe(id: any): Observable<any> {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return this.http.get<any>(`/server/commentaires/recipe/${id}`)
      .pipe(map((data: any) => {
        console.log(data);
        data.forEach(element => {
          this.http.get(`/server/image/commentaire/${element.idCommentaire}`).subscribe((data: any) => {
            console.log(data);
            element.lienImage = data[0]?.lienImage;
          });

          const d = new Date(element.dateCommentaire);

          element.dateCommentaire = d.toLocaleString('FR-fr', options);

          this.auth.getUser(element.ecritPar).subscribe(data => {
            element.admin = data.admin;
          });
          let element2 = element;
          let bool = true;

          while (bool) {
            this.getReponseCommentaireRecipe(id, element.idCommentaire).subscribe(commentaire => {
              element.children = commentaire;
            });
            if (element2.children) {
              element2 = element2.children;
            } else {
              bool = false;
            }

          }
        });
        console.log(data);
        return data;
      }));
  }

  public getReponseCommentaireRecipe(id: any, idCommentaire: any): Observable<any> {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return this.http.get<any>(`/server/commentaires/recipe/${id}/reponse/${idCommentaire}`)
      .pipe(map((commentaire: any) => {
        commentaire.forEach(element => {
          this.http.get(`/server/image/commentaire/${element.idCommentaire}`).subscribe((data: any) => {
            console.log(data);
            element.lienImage = data[0]?.lienImage;
          });

          const d = new Date(element.dateCommentaire);

          element.dateCommentaire = d.toLocaleString('FR-fr', options);

          this.auth.getUser(element.ecritPar).subscribe(data => {
            element.admin = data.admin;
          });
          this.getReponseCommentaireRecipe(id, element.idCommentaire).subscribe(commentaire => {
            element.children = commentaire;
          });
        });
        return commentaire;
      }));
  }

  public deleteCommentaire(id: any): Observable<any> {
    const url = `/server/commentaires/commentaire/${id}/delete`;
    return this.http.delete<any>(url).pipe(
      tap(_ => console.log(`deleted ${id}`)),
    );
  }

  public getCommentaireUser(pseudo: any): Observable<any> {
    return this.http.get<any>(`/server/commentaires/${pseudo}/mescommentaires`)
      .pipe(map((data: any) => {
        return data;
      }));
  }
}
