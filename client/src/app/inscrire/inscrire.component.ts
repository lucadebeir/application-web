import { Component, OnInit } from '@angular/core';
import { AuthentificationService, TokenPayload } from '../service/authentification.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

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
    abonneNews: false,
    error: ''
  }

  constructor(private auth: AuthentificationService, private router: Router) { }

  ngOnInit() {
  } 

  register() {
    
    this.auth.register(this.credentials).subscribe(
      (res) => {
        if (res.error) {
          this.credentials.pseudo = ''
          this.credentials.email = ''
          this.credentials.mdp = ''
          this.credentials.mdp2 = ''
          this.credentials.error = res.error
          this.router.navigateByUrl('/register')
        } else {
          this.router.navigateByUrl('/profile')
        }
      },
      err => {
        console.error(err)
      }
    )
  }

}
