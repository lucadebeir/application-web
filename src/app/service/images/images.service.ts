import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ImagesService {
  baseUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  public addImage(file: any): Observable<any> {
    return this.http.post(this.baseUrl + `/server/image/uploads`, file).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getImage(id: number): any {
    return this.http.get(this.baseUrl + `/server/image/${id}`).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public addImageToRecipe(imageToModify: any): any {
    this.http
      .post<any>(
        this.baseUrl + `/server/image/recipe/update/image`,
        imageToModify
      )
      .subscribe((data: any) => {
        return data;
      });
  }
}
