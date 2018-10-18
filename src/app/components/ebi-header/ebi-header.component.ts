import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'angular-aap-auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'ebi-header',
  templateUrl: './ebi-header.component.html',
  styleUrls: ['./ebi-header.component.scss'],
  providers: [AuthService]
})
export class EbiHeaderComponent {

  @Input() title: string;
  @Input() href = '/';
  @Input() image = 'https://www.ebi.ac.uk/web_guidelines/images/banners/EBI_SERVICES_Banner_2016.jpg';
  @Input() color = '#091316';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {  }

  onLogout() {
    this.authService.logOut();
    this.router.navigate(['/user/login']);
  }
}
