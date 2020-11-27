import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  pageName: string;

  constructor(private route: ActivatedRoute, private router: Router) {


  }

  ngOnInit(): void {
    // this.pageName = this.route.snapshot.data.pageTitle;

    console.log(this.route.snapshot);

    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        this.pageName = data.state.root.firstChild.data.pageTitle;
      }
    });
  }

}


