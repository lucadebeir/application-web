import { Component, OnInit } from '@angular/core';
import { RecettesService, AuthentificationService, CommentaireDetails, UserDetails } from '../../service';
@Component({
  selector: 'app-mes-commentaires',
  templateUrl: './mes-commentaires.component.html',
  styleUrls: ['./mes-commentaires.component.css']
})
export class MesCommentairesComponent implements OnInit {

  public commentaires : CommentaireDetails[]

  constructor(public auth: AuthentificationService, private recetteService: RecettesService) {
    this.recetteService.getCommentaireUser(this.auth.getUserDetails().pseudo).subscribe(
      commentaires => {
       
        this.commentaires = commentaires
        console.log(commentaires)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        this.commentaires.forEach(element => {
         
          var d = new Date(element.dateCommentaire)
      
          element.dateCommentaire = d.toLocaleString('FR-fr', options)

          this.recetteService.getRecipeById(element.concerne).subscribe(data => {
            element.nomRecette = data.nomRecette
          })          
        })
      }
    );
  
  }

  ngOnInit(): void {
  }

}
