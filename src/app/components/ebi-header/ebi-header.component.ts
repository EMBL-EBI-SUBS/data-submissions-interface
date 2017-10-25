import { Component, Input } from '@angular/core';

@Component({
  selector: 'ebi-header',
  templateUrl: './ebi-header.component.html',
  styleUrls: ['./ebi-header.component.scss']
})
export class EbiHeaderComponent {
  @Input() title: string;
  @Input() href: string = "/";

  constructor() {}
}
