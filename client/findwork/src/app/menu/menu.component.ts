import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  href = false;

  constructor() { }

  ngOnInit() {
  }

  click(value: Boolean) {
    if (value === true) {
      this.href = true;
    } else {
      this.href = false;
    }
  }


}
