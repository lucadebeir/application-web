import { Component, OnInit, ViewChild } from "@angular/core";
import { StatistiquesService } from "src/app/service/statistiques/statistiques.service";
import { UserProfile } from "src/app/models/user.model";
import { ToastrService } from "ngx-toastr";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";
import { RecettesService } from "src/app/service";
import { take } from "rxjs/operators";
import { decoder } from "../../utils/Codage";
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ChartComponent, //2eme graph à partir de là
  //ApexXAxis,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis; 
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  stroke: ApexStroke; //2e type graph
  tooltip: ApexTooltip;


};

@Component({
  selector: "app-statistiques",
  templateUrl: "./statistiques.component.html",
  styleUrls: ["./statistiques.component.scss"],
})
export class StatistiquesComponent implements OnInit {
  public nbVuesTot: any;
  public nbCommentairesTot: any;
  public nbUsers: any;
  public nbAbonnes: any;
  public users: UserProfile[];
  public notifs: Notification[];
  public bestRecipes: RecettesService[];
  public worstRecipes: RecettesService[];
  public bestMonthlyRecipes: {
    nomRecette: number;
    nbVues: number;
  }[];


  public vuesThisMonth : {
    date: Date;
    nbVues : number;
  }[];

  public comThisMonth : {
    date: Date;
    nbCom : number;
  }

  coms = [];
  date = [];


  public abosPerMonth : {
    month : number;
    nbAbos : number;
  }

  abos = [];
  month = [];

  public usersPerMonth : {
    month : number;
    nbUsers : number;
  }


  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: Partial<ChartOptions>;
  public chartOptionCV : Partial<ChartOptions>;
  public chartOptionUA : Partial<ChartOptions>;

  constructor(
    private statService: StatistiquesService,
    private toastr: ToastrService,
    public notifService: NotificationService,
    public recetteService: RecettesService
  ) {
    this.notifService.getEnabledNotifs().subscribe((data) => {
      this.notifs = data;
      data.forEach((element) => {
        if (element.type === "vue") {
          this.recetteService
            .getRecipeById(element.idRecette)
            .subscribe((recipe) => {
              this.showInfo(
                "Une nouvelle vue sur la recette " + decoder(recipe.nomRecette),
                element.idNotification,
                "view-class"
              );
            });
        } else if (element.type === "user") {
          this.showInfo(
            "Un nouvel abonné : " + element.pseudo,
            element.idNotification,
            "user-class"
          );
        } else if (element.type === "abonne") {
          this.showInfo(
            "Un nouvel inscrit : " + element.pseudo,
            element.idNotification,
            "toast-success"
          );
        } else if (element.type === "commentaire") {
          this.recetteService
            .getRecipeById(element.idRecette)
            .subscribe((recipe) => {
              this.showInfo(
                "Un nouveau commentaire sur la recette '" +
                  decoder(recipe.nomRecette) +
                  "' de la part de " +
                  element.pseudo,
                element.idNotification,
                "toast-info"
              );
            });
        } else if (element.type === "favori") {
          this.recetteService
            .getRecipeById(element.idRecette)
            .subscribe((recipe) => {
              this.showInfo(
                element.pseudo +
                  " a rajouté une nouvelle recette dans ses favoris : " +
                  decoder(recipe.nomRecette),
                element.idNotification,
                "toast-error"
              );
            });
        }
      });
    });
  }

  ngOnInit(): void {
    this.statService.getNbVuesTot().subscribe((data) => {
      this.nbVuesTot = data[0].nbVuesTot; //data[0] car donnée récupérée sous format json
    });

    this.statService.getNbCommentairesTot().subscribe((data) => {
      this.nbCommentairesTot = data[0].nbCommentairesTot;
    });

    this.statService.getNbUsers().subscribe((data) => {
      this.nbUsers = data[0].nbUsers;
    });

    this.statService.getNbAbonnes().subscribe((data) => {
      this.nbAbonnes = data[0].nbAbonnes;
    });

    this.statService.getUsers().subscribe((data) => {
      this.users = data;
    });

    this.statService.getBestRecipes().subscribe((data) => {
      this.bestRecipes = data;
      let vues = [];
      let noms = [];
      data.forEach((element) => {
        let nom = [];
        vues.push(element.nbVues);
        nom.push(element.nomRecette);
        noms.push(element.nomRecette);
      });

      this.chartOptions = {
        series: [
          {
            name: "Nombre de vues",
            data: vues,
          },
        ],
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        xaxis: {
          categories: noms,
          labels: {
            style: {
              fontSize: "8px",
            },
          },
        },
      };
    });

    this.statService.getWorstRecipes().subscribe((data) => {
      this.worstRecipes = data;
      let vues = [];
      let noms = [];
      data.forEach((element) => {
        let nom = [];
        vues.push(element.nbVues);
        nom.push(element.nomRecette);
        noms.push(element.nomRecette);
      });

      this.chartOptions2 = {
        series: [
          {
            name: "Nombre de vues",
            data: vues,
          },
        ],
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        xaxis: {
          categories: noms,
          labels: {
            style: {
              fontSize: "8px",
            },
          },
        },
      };
    });

    this.statService.getBestMonthlyRecipes().subscribe((data) => {
      this.bestMonthlyRecipes = data;
      let vues = [];
      let noms = [];
      data.forEach((element) => {
        let nom = [];
        vues.push(element.nbVues);
        nom.push(element.nomRecette);
        noms.push(element.nomRecette);
      });

      this.chartOptions3 = {
        series: [
          {
            name: "Nombre de vues",
            data: vues,
          },
        ],
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        xaxis: {
          categories: noms,
          labels: {
            style: {
              fontSize: "8px",
            },
          },
        },
      };
    });


    
    
    this.statService.getNbComPerMonth().subscribe((data2) => {
      this.comThisMonth = data2;
      data2.forEach((element2) => {
        this.coms.push(element2.nbCom);
        this.date.push(element2.date);
      });
    });
    this.statService.getNbVuesThisMonth().subscribe((data) => {
      this.vuesThisMonth = data;
      let vues = [];
      data.forEach((element) => {
        vues.push(element.nbVues);
        if(!this.date.indexOf(element.date)){
          this.date.push(element.date);
        }
        
      });

      
      

        
        //options du graph commentaires / vues    
       
        this.chartOptionCV = {
          series: [
            {
              name: "Vues",
              data: vues
            },
            {
              name: "Commentaires",
              data:  this.coms
            }
          ],
          chart: {
            height: 350,
            type: "area"
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth"
          },
          xaxis: {
            type: "category",
            categories: this.date
          }
        
        }; 
      });
     
    
      this.statService.getNbAbosPerMonth().subscribe((data) => {
        this.abosPerMonth = data;
        data.forEach((element) => {
          this.abos.push(element.nbAbos);
          this.month.push(element.month);
        });
      });
      
      this.statService.getNbUsersPerMonth().subscribe((data) => {
        this.usersPerMonth = data;
        let users = [];
        data.forEach((element) => {
          users.push(element.nbUsers);
          if(!this.month.indexOf(element.month)){
            this.month.push(element.month);
          }
        });

      //options du graph users / abonnées
      this.chartOptionUA = {
        series: [
          {
            name: "Users",
            data: users
          },
          {
            name: "Abonnés",
            data: this.abos
          }
        ],
        chart: {
          height: 350,
          type: "area"
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        xaxis: {
          type: "category",
          categories: this.month
          /*[
            "janvier",
            "février",
            "mars",
            "avril",
            "mai",
            "juin",
            "juillet",
            "août",
            "septembre",
            "octobre",
            "novembre",
            "décembre"
          ] */
        }

      }; 
    });
  
  }

  showInfo(text, id, css) {
    this.toastr
      .show(text, null, {
        toastClass: css + " ngx-toastr",
      })
      .onTap.pipe(take(1))
      .subscribe(() => this.cleanNotif(id));
  }

  showSuccess(text, id) {
    this.toastr
      .show(text, null, {
        toastClass: "toast-success ngx-toastr",
      })
      .onTap.pipe(take(1))
      .subscribe(() => this.cleanNotif(id));
  }

  showWarning(text, id) {
    this.toastr
      .warning(text)
      .onTap.pipe(take(1))
      .subscribe(() => this.cleanNotif(id));
  }

  cleanNotif(id) {
    this.notifService.updateNotif(id).subscribe();
  }
}

