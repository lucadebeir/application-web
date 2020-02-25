import { Component, OnInit } from '@angular/core';
import { AuthentificationService, TokenPayload } from '../authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscrire',
  templateUrl: './inscrire.component.html',
  styleUrls: ['./inscrire.component.css']
})
export class InscrireComponent implements OnInit {

  credentials: TokenPayload = {
    pseudo: '',
    email: '',
    mdp: '',
    mdp2: '',
    admin: false,
    abonneNews: false 
  }

  constructor(private auth: AuthentificationService, private router: Router) { }

  ngOnInit() {

  }

  register() {
    
    this.auth.register(this.credentials).subscribe(
      () => {
        console.log(this.auth.register(this.credentials).operator)
        this.router.navigateByUrl('/profile')
      },
      err => {
        console.error(err)
      }
    )
  }

}
