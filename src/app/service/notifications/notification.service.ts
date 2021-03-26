import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Notification } from "src/app/models";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  baseUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  public addNotification(notif: Notification): Observable<any> {
    return this.http
      .put(this.baseUrl + `/server/notifications/add`, notif)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public getAllNotifs(): Observable<Notification[]> {
    return this.http.get(this.baseUrl + `/server/notifications/allNotifs`).pipe(
      map((data: Notification[]) => {
        return data;
      })
    );
  }

  public getEnabledNotifs(): Observable<Notification[]> {
    return this.http
      .get(this.baseUrl + `/server/notifications/notifs/enabled`)
      .pipe(
        map((data: Notification[]) => {
          return data;
        })
      );
  }

  public updateNotif(idNotif): Observable<any> {
    return this.http
      .put(this.baseUrl + `/server/notifications/update/` + idNotif, false)
      .pipe(
        map((data: any) => {
          console.log(data);
          return data;
        })
      );
  }
}
