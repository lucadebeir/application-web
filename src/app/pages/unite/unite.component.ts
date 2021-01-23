import { Component, OnInit } from "@angular/core";
import { Observable, combineLatest, from } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { RecettesService, UnitesService } from "../../service";
import { UniteDetails } from "../../models";
import { Router } from "@angular/router";

@Component({
  selector: "app-unite",
  templateUrl: "./unite.component.html",
  styleUrls: ["./unite.component.scss"],
})
export class UniteComponent implements OnInit {
  public unites: UniteDetails[];

  public unite: UniteDetails = {
    idUnite: null,
    libelleUnite: "",
  };

  searchTerm: string = "";
  public unites$: Observable<
    UniteDetails[]
  > = this.unitesService.getSearchResults();

  constructor(private router: Router, private unitesService: UnitesService) {}

  ngOnInit(): void {
    this.loading();
  }

  loading() {
    this.unitesService.getAllUnite().subscribe((res) => {
      this.unites = res;
      setTimeout(() => {
        this.unitesService.search(this.searchTerm, res).subscribe();
        this.unite.libelleUnite = "";
      }, 1000);
    });
  }

  onSearchTermChange(): void {
    this.unitesService.search(this.searchTerm, this.unites).subscribe();
  }

  deleteUnite(idUnite: any) {
    this.unitesService.deleteUnite(idUnite).subscribe((res) => {
      this.unitesService.delete(this.unites, idUnite).subscribe();
    });
    setTimeout(() => {
      this.loading();
    }, 500);
  }

  updateUnite(unite: UniteDetails) {
    this.unitesService.updateUnite(unite).subscribe();
  }

  addUnite() {
    this.unitesService.addUnite(this.unite);
    this.unitesService.add(this.unites, this.unite).subscribe();
    setTimeout(() => {
      this.loading();
    }, 500);
  }
}
