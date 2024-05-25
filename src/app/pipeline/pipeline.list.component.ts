import {Component} from "@angular/core";
import {ProjectService} from "../project/project.service";
import {ApiService} from "../api/api.service";
import {combineLatest, filter, interval, startWith, switchMap} from "rxjs";
import {isNonNull} from "../rxjs/extensions";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {InstanceService} from "../instance/instance.service";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {StateColorClassPipe} from "./state-color-class.pipe";
import {StateIconPipe} from "./state-icon.pipe";

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        MatToolbarModule,
        SidenavToggleComponent,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
        DatePipe,
        NgClass,
        StateColorClassPipe,
        StateIconPipe,
    ],
    templateUrl: './pipeline.list.component.html'
})
export class PipelineListComponent {

    public instance$ = this.instanceService.watchCurrentInstance();

    public project$ = this.projectService.watchCurrentProject();

    public pipelines$ = combineLatest([
        this.project$.pipe(filter(isNonNull)),
        interval(10000).pipe(startWith(0))
    ]).pipe(
        switchMap(([project, _]) => this.api.projects.get(project.id).pipelines().list(100)),
    );

    constructor(
        private readonly projectService: ProjectService,
        private readonly api: ApiService,
        private readonly instanceService: InstanceService
    ) {
    }
}
