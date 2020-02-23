import { Component, OnInit } from '@angular/core';
import { AuthentificationService, UserDetails } from '../authentification.service';

@Component({
  selector: 'app-mon-profil',
  templateUrl: './mon-profil.component.html',
  styleUrls: ['./mon-profil.component.css']
})
export class MonProfilComponent implements OnInit {

  details: UserDetails

  constructor(private auth: AuthentificationService) { }

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.details = user
      },
      err => {
        console.log(err)
      }
    )
  }

}
