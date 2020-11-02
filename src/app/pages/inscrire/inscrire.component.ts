import { Component, OnInit } from '@angular/core';
import { AuthentificationService, TokenPayload } from '../../service';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-inscrire',
  templateUrl: './inscrire.component.html',
  styleUrls: ['./inscrire.component.scss']
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
  };

  userForm: FormGroup;

  // pour confirm mdp
  mdpForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private auth: AuthentificationService, private router: Router, private formBuilder: FormBuilder) {
    this.mdpForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.initForm();
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

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  register() {

    const mdpFormValue = this.mdpForm.value;
    const formValue = this.userForm.value;

    if (formValue.mdp !== formValue.mdp2) {
      alert('Les mots de passe ne sont pas identiques.');
      return;
    }

    this.credentials.pseudo = formValue.pseudo;
    this.credentials.email = formValue.email;
    this.credentials.mdp = mdpFormValue.password;
    this.credentials.mdp2 = mdpFormValue.confirmPassword;
    this.credentials.abonneNews = formValue.abonneNews;


    this.auth.register(this.credentials).subscribe(
      (res) => {
        if (res.error === 'L\'utilisateur existe déjà') {
          alert('L\'utilisateur existe déjà');
          return;
        } else {
          this.auth.logout();
          alert('Vous pouvez maintenant aller dans votre boîte mail pour confirmer votre adresse mail. Pensez à vérifier dans vos spams !');
          setTimeout(() => this.router.navigate(['login'])
          , 5);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  

}
