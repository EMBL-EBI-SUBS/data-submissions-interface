import { Component, Input } from '@angular/core';

@Component({
  selector: 'ebi-header',
  templateUrl: './ebi-header.component.html',
  styleUrls: ['./ebi-header.component.scss']
})
export class EbiHeaderComponent {
  @Input() title: string;
  @Input() href: string = "/";
  @Input() image: string = "https://www.ebi.ac.uk/web_guidelines/images/banners/EBI_SERVICES_Banner_2016.jpg";
  @Input() color: string = "#091316";
  @Input() links: any = [
    {"title": "New submission", "href": "/submission"},
    {"title": "Your dashboard", "href": "/dashboard"},
    {"title": "Your library", "href": "/library"},
    {"title": "About & help", "href": "/help"},
  ];

  constructor() {}
}
