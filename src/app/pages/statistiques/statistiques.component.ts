import { Component, OnInit } from '@angular/core';
import { StatistiquesService } from 'src/app/service/statistiques/statistiques.service';
import { UserProfile } from 'src/app/models/user.model';


@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {

  public nbVuesTot: any;
  public nbCommentairesTot: any;
  public nbUsers: any;
  public nbAbonnes: any;
  public users: UserProfile[];

  constructor(private statService: StatistiquesService) { }

  ngOnInit(): void {

    this.statService.getNbVuesTot().subscribe(
      data => {

        this.nbVuesTot = data[0].nbVuesTot; //data[0] car donnée récupérée sous format json
      
      }
    );

    this.statService.getNbCommentairesTot().subscribe(
      data => {
        this.nbCommentairesTot = data[0].nbCommentairesTot;
      }
    );


    this.statService.getNbUsers().subscribe(
      data => {
        this.nbUsers = data[0].nbUsers;
      }
    );

    this.statService.getNbAbonnes().subscribe(
      data => {
        this.nbAbonnes = data[0].nbAbonnes;
      }
    );

    this.statService.getUsers().subscribe(
      data => {
        this.users = data
      }
    );
  }




 



}

