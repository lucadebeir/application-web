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
    pseudo: this.auth.getUserDetails().pseudo,
    mdp: '',
    newmdp: '',
    mdp2: '',
    error: '',
    success: ''
  }
  constructor(private auth: AuthentificationService, private router: Router) { }

  ngOnInit() {
  }

  updatePassword(){
      this.auth.updatePassword(this.credentials).subscribe((res: any) => {
        console.log(res)
        if (res.error) {
          this.credentials.pseudo = ''
          this.credentials.mdp = ''
          this.credentials.mdp2 = ''
          this.credentials.error = res.error
          this.router.navigateByUrl('/update-password')
        } else {
          this.credentials.success = res.success
          this.router.navigate(['/profile'],{ queryParamsHandling: res.success })
        }}, (err: any) => {
          console.log(err);
        }
      );
  }
}
