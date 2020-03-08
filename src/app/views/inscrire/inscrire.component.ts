import { Component, OnInit } from '@angular/core';
import { AuthentificationService, TokenPayload } from '../../service/';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

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

  userForm: FormGroup;

  constructor(private auth: AuthentificationService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm()
  }
  
  // We Init the form with the validators
  initForm() {
    this.userForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mdp: ['', Validators.required],
      mdp2: ['', Validators.required],
      abonneNews: ['', Validators.required]

    });
  }

  register() {

    const formValue = this.userForm.value;

    if (formValue.mdp != formValue.mdp2) {
      alert("Les mots de passe ne sont pas identiques.");
      return;
    }

    this.credentials.pseudo = formValue.pseudo;
    this.credentials.email = formValue.email;
    this.credentials.mdp = formValue.mdp;
    this.credentials.mdp2 = formValue.mdp2;
    this.credentials.abonneNews = formValue.abonneNews;

    
    this.auth.register(this.credentials).subscribe(
      (res) => {
        if (res.error == "L'utilisateur existe déjà") {
          alert("L'utilisateur existe déjà");
          return;
        } else {
          this.router.navigate(['profile']);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

}
