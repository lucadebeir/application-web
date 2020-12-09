import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-filter-recettes",
  templateUrl: "./filter-recettes.component.html",
  styleUrls: ["./filter-recettes.component.scss"],
})
export class FilterRecettesComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<FilterRecettesComponent>) {}

  ngOnInit() {}

  actionFunction() {
    alert("I am a work in progress");
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
