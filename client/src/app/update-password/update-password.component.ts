import { Component, OnInit } from '@angular/core';
import { AuthentificationService, UserMdp } from '../authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  credentials: UserMdp = {
    mdp: '',
    newmdp: '',
    mdp2: '',
    
  }
  constructor(private auth: AuthentificationService, private router: Router) { }

  ngOnInit() {
  }

  updatePassword(){
      this.auth.updatePassword(this.credentials).subscribe(
        () => {
          this.router.navigateByUrl('/profile')
        },
        err => {
          console.error(err)
        }
      )
  }
}
