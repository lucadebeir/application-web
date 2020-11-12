import { Component, OnInit } from '@angular/core';
import { RecettesService, AuthentificationService, CommentairesService } from '../../service';
import { CommentaireDetails } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mes-commentaires',
  templateUrl: './mes-commentaires.component.html',
  styleUrls: ['./mes-commentaires.component.scss']
})
export class MesCommentairesComponent implements OnInit {

  public commentaires: CommentaireDetails[];

  public commentaireToModify: CommentaireDetails = {
    ecritPar: this.auth.getUserDetails().pseudo
  };

  constructor(public auth: AuthentificationService, private recetteService: RecettesService,
              private modalService: NgbModal, private router: Router, private commentairesService: CommentairesService,private notifService: NotificationService) {
    this.commentairesService.getCommentaireUser(this.auth.getUserDetails().pseudo).subscribe(
      commentaires => {

        this.commentaires = commentaires;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        this.commentaires.forEach(element => {

          const d = new Date(element.dateCommentaire);

          element.dateCommentaire = d.toLocaleString('FR-fr', options);

          this.recetteService.getRecipeById(element.concerne).subscribe(data => {
            element.nomRecette = data.nomRecette;
          });
        });
      }
    );

  }

  ngOnInit(): void {
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.commentaireToModify.message = result.message;
        this.commentaireToModify.dateCommentaire = result.dateCommentaire;
        this.commentaireToModify.concerne = result.concerne;
        this.commentairesService.modifyCommentaire(this.commentaireToModify);
        this.router.navigate(['/refresh'], {
          queryParams: {url: 'comment'}
        });
      });
  }

  deleteCommentaire(idCommentaire: any) {
    this.commentairesService.deleteCommentaire(idCommentaire)
      .subscribe(res => {
        this.router.navigate(['/comment']).then(() => {
          window.location.reload();
        });
        }, (err) => {
          console.log(err);
        }
      );
    window.location.reload(); /* rafraichit la page */
  }
  updateNbView(commentaire: any) {
    this.recetteService.getRecipeById(commentaire.concerne).subscribe(recipe => {
      this.recetteService.updateNbView(recipe).subscribe(
        (res) => {
          this.notificationVue(recipe.idRecette);
          console.log("2")
          this.router.navigate(['/recipe', recipe.idRecette]).then(() => {
            window.location.reload();
          });
        }, err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 402) {
              console.log('Cette recette n\'existe pas !');
            }
          }
        });
    })
  }
   //notification vue
   notificationVue(idRecette) {
    let notif: Notification = {
      pseudo: null,
      idRecette: idRecette,
      type: "vue",
    };
    this.notifService.addNotification(notif).subscribe();
  }
}


