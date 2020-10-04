import { Component, OnInit } from '@angular/core';
import { StatistiquesService } from 'src/app/service/statistiques/statistiques.service';


@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {

  public nbVuesTot : number;

  constructor(private statService: StatistiquesService) { }

  ngOnInit(): void {

    this.statService.getNbVuesTot().subscribe(
      nbVuesTot => {

        this.nbVuesTot = nbVuesTot;
      
      }
    );
  }

 



}

