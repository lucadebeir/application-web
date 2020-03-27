import { Component, OnInit } from '@angular/core';
import { AuthentificationService, TokenPayload } from '../../service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

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
          if (this.auth.emailConfirmed()) {
            this.router.navigateByUrl('/profile')
            alert("Bienvenue sur Marine's Recipe")
          } else {
            this.auth.logout()
            window.location.reload()
            alert("Vous devez vérifier votre adresse mail avant de pouvoir vous connecter ! :)")
          }
          
        }
      },
      err => {
        console.error(err)
      }
    )
  }

  //Fonction appelée lors du clic
  clicSurBouton(){
    alert("Si vous n'avez pas reçu de mail pour la confirmation de votre adresse mail, veuillez consulter vos mails indésirables. Si le problème persiste, veuillez nous contacter via l'onglet Contact.");
  }

}
