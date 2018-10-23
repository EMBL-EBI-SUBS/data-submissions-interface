import { NgModule } from '@angular/core';

import { EndpointService } from './endpoint.service';
import { FileService } from './file.service';
import { ProjectsService } from './projects.service';
import { RequestsService } from './requests.service';
import { SpreadsheetsService } from './spreadsheets.service';
import { SubmissionsService } from './submissions.service';
import { TeamsService } from './teams.service';
import { UserService } from './user.service';
import { VariablesService } from './variables.service';

@NgModule({
  providers: [
    EndpointService,
    FileService,
    ProjectsService,
    RequestsService,
    SpreadsheetsService,
    SubmissionsService,
    TeamsService,
    UserService,
    VariablesService
  ],
})
export class ServiceModule { }
