import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  public notifInscription(notif: Notification): Observable<any> {
    return this.http.post(`/server/notifications/add`, notif)
      .pipe(map((data: any) => {
        return data;
      }));
  }
}
