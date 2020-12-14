import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { ContactDetail } from "../pages/contact/contact.component";
import { UserProfile } from "../models/user.model";
import { environment } from "../../environments/environment";

// login
export interface UserDetails {
  pseudo: string;
  email: string;
  mdp: string;
  admin: boolean;
  emailConfirmed?: boolean;
  abonneNews: boolean;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
  error: string;
}

interface Response {
  error: string;
}

// inscription
export interface TokenPayload {
  pseudo: string;
  email: string;
  mdp: string;
  mdp2: string;
  admin: boolean;
  abonneNews: boolean;
  error: string;
}

// changement mdp
export interface UserMdp {
  pseudo: string;
  mdp: string;
  newmdp: string;
  mdp2: string;
  error: string;
  success: string;
}

@Injectable()
export class AuthentificationService {
  private token: string;
  private error: string;

  baseUrl: string = environment.API_URL;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem("userToken", token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("userToken");
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public emailConfirmed(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.emailConfirmed;
    } else {
      return false;
    }
  }

  public isAdmin(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.admin;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    const base = this.http.post(this.baseUrl + "/server/register", user);

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }

  public login(user: TokenPayload): Observable<any> {
    const base = this.http.post(this.baseUrl + "/server/login", user);
    const request = base.pipe(
      map((data: TokenResponse) => {
        // map permet de récupérer des données
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }

  public profile(): Observable<any> {
    return this.http.get(this.baseUrl + "/server/profile", {
      headers: { Authorization: `${this.getToken()}` },
    });
  }

  public logout(): void {
    this.token = "";
    window.localStorage.removeItem("userToken");
    this.router.navigateByUrl("/");
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public updatePassword(user: UserMdp): Observable<any> {
    const base = this.http.put(
      this.baseUrl + `/server/update-password/${user.pseudo}`,
      user
    );

    return base.pipe(
      map((data: Response) => {
        return data;
      })
    );
  }

  public deleteProfile(pseudo: string): Observable<any> {
    const url = this.baseUrl + `/server/delete-profile/${pseudo}`;
    return this.http.delete<any>(url).pipe(
      tap((_) => console.log(`deleted ${pseudo}`)),
      catchError(this.handleError<any>("deleteProfile"))
    );
  }

  public updateProfile(user: UserProfile): Observable<any> {
    const base = this.http.put(
      this.baseUrl + `/server/mon-profile/${user.pseudo}`,
      user
    );

    return base.pipe(
      tap((_) => console.log(`updated ${user.pseudo}`)),
      catchError(this.handleError<any>("updateProfile"))
    );
  }

  public getAbonneNews(): any {
    return this.http.get(this.baseUrl + `/server/abonneNews`);
  }

  public getAllEmail(): any {
    return this.http.get(this.baseUrl + `/server/users/email`);
  }

  public getAllPseudo(): any {
    return this.http.get(this.baseUrl + `/server/users/pseudo`);
  }

  public sentEmailToNewRecipe(to: any, idRecette: number): any {
    return this.http.get(
      this.baseUrl + `/server/newRecipe/${to.pseudo}/${idRecette}`
    );
  }

  public requestReset(body): Observable<any> {
    return this.http.post(this.baseUrl + `/server/req-reset-password`, body);
  }

  public newPassword(body): Observable<any> {
    return this.http.post(this.baseUrl + `/server/new-password`, body);
  }

  public ValidPasswordToken(body): Observable<any> {
    return this.http.post(this.baseUrl + `/server/valid-password-token`, body);
  }

  public sendEmailContact(infos: ContactDetail): any {
    let params = new HttpParams();

    params = params.append(`name`, infos.nameUser);
    params = params.append(`email`, infos.emailUser);
    params = params.append(`subject`, infos.subject);
    params = params.append(`message`, infos.message);

    return this.http.get(this.baseUrl + `/server/contact/send`, { params });
  }

  public getUser(pseudo: string): any {
    return this.http.get(this.baseUrl + `/server/user/${pseudo}`);
  }
}
