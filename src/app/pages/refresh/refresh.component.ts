import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-refresh",
  templateUrl: "./refresh.component.html",
  styleUrls: ["./refresh.component.scss"],
})
export class RefreshComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private route: Router) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.url) {
        this.route.navigate([params.url]);
      }
    });
  }
}
