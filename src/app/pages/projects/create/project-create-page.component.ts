import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'project-create-page',
  templateUrl: './project-create-page.component.html',
  styleUrls: ['./project-create-page.component.scss']
})
export class ProjectCreatePageComponent implements OnInit {
  projectForm: any;

  constructor(
  ) { }

  ngOnInit() {
    this.projectForm = new FormGroup({
      project: new FormControl('_create', Validators.required),
      projectTitle: new FormControl('', Validators.required),
      projectDescription: new FormControl(''),
    });
  }

  onCreateProject() {

  }
}
