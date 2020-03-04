import { Component, OnInit } from '@angular/core';
import { RecettesService } from '../service/recettes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; //la fenetre qui pop pour ajouter l'ingrédient pendant création d'une recette = modal
@Component({
  selector: 'app-modal-add-ingredient',
  templateUrl: './modal-add-ingredient.component.html',
  styleUrls: ['./modal-add-ingredient.component.css']
})
export class ModalAddIngredientComponent implements OnInit {
  public newIngredient: NewIngredient = {
    nomIngredient: ''
  }
  constructor(private recettesService: RecettesService, private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  //récupérer le nom du new ingrédient et l'enregistrer dans la bd
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.newIngredient.nomIngredient = result
        this.recettesService.addIngredient(this.newIngredient)
        //window.location.reload() ?????? voir car si on fait ça on perd tout les champs du questionnaire et sinon on a pas le new ingredient dans les choix -> utiliser cookie?
      })
  }
}

export interface NewIngredient {
  nomIngredient: string
}