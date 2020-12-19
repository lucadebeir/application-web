import { Component, OnInit } from "@angular/core";
import { AuthentificationService, TokenPayload } from "../../service";
import { Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AlertService } from "src/app/_alert";

@Component({
  selector: "app-se-connecter",
  templateUrl: "./se-connecter.component.html",
  styleUrls: ["./se-connecter.component.scss"],
})
export class SeConnecterComponent implements OnInit {
  options = {
    autoClose: false,
    keepAfterRouteChange: false,
  };

  loginForm: FormGroup;

  credentials: TokenPayload = {
    pseudo: "",
    email: "",
    mdp: "",
    mdp2: "",
    admin: false,
    abonneNews: true,
    error: "",
  };

  constructor(
    private auth: AuthentificationService,
    private router: Router,
    private formBuilder: FormBuilder,
    public alertService: AlertService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      pseudo: ["", Validators.required],
      mdp: ["", Validators.required],
    });
  }

  login() {
    const formValue = this.loginForm.value;
    this.credentials.pseudo = formValue.pseudo;
    this.credentials.mdp = formValue.mdp;

    this.auth.login(this.credentials).subscribe(
      (res) => {
        console.log(res);
        if (
          res.error === "Mot de passe et/ou pseudo incorrect" ||
          res.error ===
            "Vous devez vérifier votre adresse mail avant de pouvoir vous connecter ! :)"
        ) {
          this.alertService.error(res.error, this.options);
          this.initForm();
        } else {
          this.router.navigateByUrl("/");
          alert("Bienvenue sur Marine's Recipe");
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Fonction appelée lors du clic
  clicSurBouton() {
    this.alertService.warn(
      "Si vous n'avez pas reçu de mail pour la confirmation de votre adresse mail," +
        "veuillez consulter vos mails indésirables. Si le problème persiste, veuillez nous contacter via l'onglet Contact.",
      this.options
    );
  }
}
