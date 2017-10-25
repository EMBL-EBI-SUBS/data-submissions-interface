/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  AfterContentInit
} from '@angular/core';

declare var $;

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app-root',
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor() {}

  ngAfterViewInit() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }
}
