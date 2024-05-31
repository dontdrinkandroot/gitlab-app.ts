import {Component} from "@angular/core";
import {ApiService} from "../api/api.service";
import {RouterLink} from "@angular/router";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {switchMap} from "rxjs/operators";
import {isNonNull} from "../rxjs/extensions";
import {filter} from "rxjs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {StateColorClassPipe} from "../pipeline/state-color-class.pipe";
import {StateIconPipe} from "../pipeline/state-icon.pipe";
import {ProjectContext} from "./project-context.service";

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        MatToolbarModule,
        SidenavToggleComponent,
        MatProgressSpinnerModule,
        MatListModule,
        RouterLink,
        MatIconModule,
        DatePipe,
        NgClass,
        StateColorClassPipe,
        StateIconPipe,
    ],
    templateUrl: './project.detail.component.html'
})
export class ProjectDetailComponent {

    public project$ = this.projectContext.watchProject().pipe(filter(isNonNull));

    public latestPipelines$ = this.project$.pipe(
        switchMap(project => this.api.instance(project.instance).projects.get(project.id).pipelines.list(5))
    );

    constructor(
        private readonly api: ApiService,
        private readonly projectContext: ProjectContext
    ) {
    }
}
