import {Component} from "@angular/core";
import {ApiService} from "../api/api.service";
import {combineLatest, filter, interval, startWith, switchMap} from "rxjs";
import {isNonNull} from "../rxjs/extensions";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {StateColorClassPipe} from "./state-color-class.pipe";
import {StateIconPipe} from "./state-icon.pipe";
import {InstanceContext} from "../instance/instance-context.service";
import {ProjectContext} from "../project/project-context.service";

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

    public instance$ = this.instanceContext.watchInstance().pipe(filter(isNonNull));

    public project$ = this.projectContext.watchProject().pipe(filter(isNonNull));

    public pipelines$ = combineLatest([
        this.project$.pipe(filter(isNonNull)),
        interval(10000).pipe(startWith(0))
    ]).pipe(
        switchMap(([project, _]) => this.api.instance(project.instance).projects.get(project.id).pipelines.list(100)),
    );

    constructor(
        private readonly instanceContext: InstanceContext,
        private readonly projectContext: ProjectContext,
        private readonly api: ApiService,
    ) {
    }
}
