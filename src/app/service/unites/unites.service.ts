import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { UniteDetails } from 'src/app/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitesService {

  constructor(private http: HttpClient) { }

  public getAllUnite(): Observable<UniteDetails[]> {
    return this.http.get<any>('/server/unite')
      .pipe(map((data: UniteDetails[]) => {
        return data;
      }));
  }

  public deleteUnite(id: any): Observable<any> {
    const url = `/server/unite/delete/${id}`;
    return this.http.delete<any>(url).pipe(
      tap(_ => console.log(`deleted ${id}`)),
    );
  }

  public updateUnite(unite: UniteDetails): Observable<any> {
    return this.http.put(`/server/unite/update`, unite)
      .pipe(map((data: UniteDetails[]) => {
        return data;
      }));
  }

  public addUnite(unite: any): any {
    this.http.post('/server/unite/add', unite).subscribe(res => {
      {
        return res;
      }
    });
  }

  public getUniteById(idUnite: any): Observable<UniteDetails> {
    const base = this.http.get('/server/recipe/unite/' + idUnite);
    return base.pipe(map((data: UniteDetails) => {
        return data;
    }));
}
}
