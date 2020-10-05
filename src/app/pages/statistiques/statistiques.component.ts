import { Component, OnInit } from '@angular/core';
import { StatistiquesService } from 'src/app/service/statistiques/statistiques.service';


@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {

  public nbVuesTot: any;

  constructor(private statService: StatistiquesService) { }

  ngOnInit(): void {

    this.statService.getNbVuesTot().subscribe(
      data => {

        console.log(data[0].nbVuesTot)
        this.nbVuesTot = data[0].nbVuesTot; //data[0] car donnée récupérée sous format json
      
      }
    );
  }

 



}

