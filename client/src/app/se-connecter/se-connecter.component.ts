import { Component, OnInit } from '@angular/core';
import { AuthentificationService, TokenPayload } from '../service/authentification.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-se-connecter',
  templateUrl: './se-connecter.component.html',
  styleUrls: ['./se-connecter.component.css']
})
export class SeConnecterComponent implements OnInit {

  loginForm: FormGroup

  credentials: TokenPayload = {
    pseudo: '',
    email: '',
    mdp: '',
    mdp2: '',
    admin: false,
    abonneNews: true,
    error: ''
  }

  constructor(private auth: AuthentificationService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      mdp: ['', Validators.required],
    });
  }

  login() {

    const formValue = this.loginForm.value;
    this.credentials.pseudo = formValue.pseudo;
    this.credentials.mdp = formValue.mdp;

    this.auth.login(this.credentials).subscribe(
      (res) => {
        if (res.error == "Mot de passe et/ou pseudo incorrect") {
          alert(res.error);
        } else {
          this.router.navigateByUrl('/profile')
          alert("Bienvenue sur Marine's Recipe")
        }
      },
      err => {
        console.error(err)
      }
    )
  }

}
