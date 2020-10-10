import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {

  constructor(private http: HttpClient) { }

  public getNbVuesTot(): any {
    return this.http.get<any>(`/server/statistique/nbVuesTot`)
      .pipe(map((data:any) => {
        return data;
        
      }));
  }

  public getNbCommentairesTot(): any {
    return this.http.get<any>(`/server/statistique/nbCommentairesTot`)
    .pipe(map((data:any) => {
      return data;
    }));
  }

  public getNbUsers(): any {
    return this.http.get<any>(`/server/statistique/nbUsers`)
    .pipe(map((data:any) => {
      return data;
    }));
  }

  public getNbAbonnes(): any {
    return this.http.get<any>(`/server/statistique/nbAbonnes`)
    .pipe(map((data:any) => {
      return data;
    }));
  }

  public getUsers(): any{
    return this.http.get<any>(`/server/statistique/users`)
    .pipe(map((data:any) => {
      return data;
    }));
  }
}

