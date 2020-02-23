import { Component, OnInit } from '@angular/core';
import { AuthentificationService, TokenPayload } from '../authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-se-connecter',
  templateUrl: './se-connecter.component.html',
  styleUrls: ['./se-connecter.component.css']
})
export class SeConnecterComponent implements OnInit {

  credentials: TokenPayload = {
    pseudo: '',
    email: '',
    mdp: '',
    admin: false,
    abonneNews: false
  }

  constructor(private auth: AuthentificationService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/profile')
      },
      err => {
        console.error(err)
      }
    )
  }

}
