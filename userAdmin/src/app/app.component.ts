import { Component } from '@angular/core';
import { CommonService } from './shared/services/common.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
   public commonService: CommonService,
  ) {}
  async ngOnInit() {
  }
 
}
