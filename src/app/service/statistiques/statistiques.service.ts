import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { decoder, encoder } from "../../utils/Codage";

@Injectable({
  providedIn: "root",
})
export class StatistiquesService {
  baseUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  public getNbVuesTot(): any {
    return this.http
      .get<any>(this.baseUrl + `/server/statistique/nbVuesTot`)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public getNbCommentairesTot(): any {
    return this.http
      .get<any>(this.baseUrl + `/server/statistique/nbCommentairesTot`)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public getNbUsers(): any {
    return this.http
      .get<any>(this.baseUrl + `/server/statistique/nbUsers`)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public getNbAbonnes(): any {
    return this.http
      .get<any>(this.baseUrl + `/server/statistique/nbAbonnes`)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public getUsers(): any {
    return this.http.get<any>(this.baseUrl + `/server/statistique/users`).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getBestRecipes(): any {
    return this.http
      .get<any>(this.baseUrl + `/server/statistique/bestRecipes`)
      .pipe(
        map((data: any) => {
          data.forEach((element) => {
            element.nomRecette = decoder(element.nomRecette);
          });
          return data;
        })
      );
  }
  public getWorstRecipes(): any {
    return this.http
      .get<any>(this.baseUrl + `/server/statistique/worstRecipes`)
      .pipe(
        map((data: any) => {
          data.forEach((element) => {
            element.nomRecette = decoder(element.nomRecette);
          });
          return data;
        })
      );
  }
  public getBestMonthlyRecipes(): any {
    return this.http
      .get<any>(this.baseUrl + `/server/statistique/bestMonthlyRecipes`)
      .pipe(
        map((data: any) => {
          data.forEach((element) => {
            element.nomRecette = decoder(element.nomRecette);
          });
          return data;
        })
      );
  }
}
