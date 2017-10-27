import { Component, Input, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'angular-aap-auth';

@Component({
  selector: 'ebi-header',
  templateUrl: './ebi-header.component.html',
  styleUrls: ['./ebi-header.component.scss'],
  providers: []
})
export class EbiHeaderComponent {
  private tokenListener: Function;

  @Input() title: string;
  @Input() href: string = "/";
  @Input() image: string = "https://www.ebi.ac.uk/web_guidelines/images/banners/EBI_SERVICES_Banner_2016.jpg";
  @Input() color: string = "#091316";

  constructor(
    private authService: AuthService,
    public renderer: Renderer,
    private router: Router
  ) {
    this.tokenListener = this.authService.getTokenListenerRemover(renderer, () => { });
  }

  isLoggedIn() {
    return this.authService.loggedIn();
  }

  onLogout() {
    this.authService.logOut();
    this.router.navigate(["/home"]);
  }
}
