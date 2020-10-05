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
        console.log(data)
        return data;
        
      }));
  }
}

