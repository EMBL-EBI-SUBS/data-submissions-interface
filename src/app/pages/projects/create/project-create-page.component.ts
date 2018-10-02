import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

declare var Choices;

@Component({
  selector: 'project-create-page',
  templateUrl: './project-create-page.component.html',
  styleUrls: ['./project-create-page.component.scss'],
  providers: [
    TokenService
  ]
})
export class ProjectCreatePageComponent implements OnInit {
  token: string;
  projectForm: any;

  constructor(
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();

    this.projectForm = new FormGroup({
      project: new FormControl('_create', Validators.required),
      projectTitle: new FormControl('', Validators.required),
      projectDescription: new FormControl(''),
      projectShortName: new FormControl('', Validators.required),
    });
  }

  onCreateProject() {

  }
}
