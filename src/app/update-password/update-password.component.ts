import { Component, OnInit } from '@angular/core';
import { AuthentificationService, UserMdp } from '../service/authentification.service';
import { Router } from '@angular/router';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  public updatePasswordForm: FormGroup

  constructor(private auth: AuthentificationService, private router: Router, private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initUpdatePasswordForm()
  }

  initUpdatePasswordForm() {
    this.updatePasswordForm = this.formBuilder.group({
      mdp: ['', Validators.required],
      newmdp: ['', [Validators.required]],
      mdp2: ['', Validators.required]
    });
  }

  updatePassword() {

    const formValue = this.updatePasswordForm.value;

    this.credentials.mdp = formValue.mdp
    this.credentials.newmdp = formValue.newmdp
    this.credentials.mdp2 = formValue.mdp2

    this.initUpdatePasswordForm()

    if (formValue.newmdp != formValue.mdp2) {
      alert("Les nouveaux mots de passe ne sont pas identiques.");
      return;
    }

    this.auth.updatePassword(this.credentials).subscribe((res: any) => {
      if (res.error == "Mot de passe incorrect!") {
        console.log(res.error)
        alert("L'ancien mot de passe n'est pas correct.");
        return;
      } else {
        this.router.navigateByUrl('/profile')
      }
    }, (err: any) => {
      console.log(err);
    }
    );
  }
}
