import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-filter-recettes",
  templateUrl: "./filter-recettes.component.html",
  styleUrls: ["./filter-recettes.component.scss"],
})
export class FilterRecettesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<FilterRecettesComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {}

  ngOnInit() {}

  actionFunction() {
    alert("I am a work in progress");
    this.closeModal("ok");
  }

  reset() {
    this.modalData.populaire = false;
    this.modalData.recent = true;
    this.modalData.categories.forEach((element) => {
      element.checked = false;
    });
    this.modalData.checked = true;
    this.modalData.times.forEach((time) => {
      time.filter = false;
    });
  }

  clickCheckbox(condition?: string) {
    if (condition === "one") {
      this.modalData.checked = false;
    }
    if (condition === "all") {
      this.modalData.categories.forEach((element) => {
        element.checked = false;
      });
    }
    if (condition === "populaire") {
      this.modalData.recent = false;
    }
    if (condition === "recent") {
      this.modalData.populaire = false;
    }
  }

  closeModal(close?) {
    if (close) {
      this.dialogRef.close(this.modalData);
    } else {
      this.dialogRef.close();
    }
  }
}
