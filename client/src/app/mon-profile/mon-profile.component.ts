import { Component, OnInit } from '@angular/core';
import { AuthentificationService, UserProfile } from '../authentification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mon-profile',
  templateUrl: './mon-profile.component.html',
  styleUrls: ['./mon-profile.component.css']
})
export class MonProfileComponent implements OnInit {

  credentials: UserProfile = {
    pseudo: '',
    email: '',
    abonneNews: true, //changer pour que ce soit la valeur du formulaire
    
  }

  constructor(private auth: AuthentificationService, private router: Router) { }

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.credentials = user
      },
      err => {
        console.error(err)
      }
    )
  }

  updateProfile(){
    this.auth.updateProfile(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/profile')
      },
      err => {
        console.error(err)
      }
    )
}
}
