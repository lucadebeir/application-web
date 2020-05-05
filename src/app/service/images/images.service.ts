import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient) { }

  public addImage(file: any): Observable<any> {
    console.log(file);
    return this.http.post(`/server/image/uploads`, file).pipe(map((data: any) => {
      return data;
    }));
  }

  public getImage(id: number): any {
    return this.http.get(`/server/image/${id}`).pipe(map((data: any) => {
      console.log(data);
      return data;
    }));
  }

  public addImageToRecipe(imageToModify: any): any {
    this.http.post<any>(`/server/image/recipe/update/image`, imageToModify)
      .subscribe((data: any) => {
        console.log(data);
        return data;
      });
  }
}
