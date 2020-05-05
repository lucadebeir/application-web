import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListeCoursesDetails, IngredientDetails } from 'src/app/models';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthentificationService } from '../authentification.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  constructor(private http: HttpClient, private auth: AuthentificationService) { }

  public addListeCourses(newListeCourses: ListeCoursesDetails) {
    this.http.post(`/server/shoppingList/add`, newListeCourses).subscribe(res => {
      {
        return res;
      }

    });
  }

  public getListeCourses(): Observable<IngredientDetails[]> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const base = this.http.get(`/server/shoppingList/${pseudo}`);
    return base.pipe(map((data: IngredientDetails[]) => {
      return data;
    }));

  }

  public getRestListeCourses(): Observable<IngredientDetails[]> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const base = this.http.get(`/server/shoppingList/rest/${pseudo}`);
    return base.pipe(map((data: IngredientDetails[]) => {
      return data;
    }));
  }

  public addIngredientShoppingList(ingredient: any): any {
    return this.http.post(`/server/shoppingList/add/ingredient`, ingredient).subscribe(res => {
      {
        return res;
      }
    });

  }

  public deleteListeCourse(id: any): Observable<any> {
    const pseudo = this.auth.getUserDetails().pseudo;
    const url = `/server/shoppingList/delete/${id}/${pseudo}`;
    return this.http.delete<any>(url).pipe(
      tap(_ => console.log(`deleted ${id}`)),
    );
  }
}
