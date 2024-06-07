import {Component} from "@angular/core";
import {combineLatest, filter, interval, startWith, switchMap} from "rxjs";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {InstanceContext} from "../../../../service/instance-context.service";
import {ProjectContext} from "../../../../service/project-context.service";
import {ApiService} from "../../../../service/api/api.service";
import {isNonNull} from "../../../../rxjs-extensions";
import {StateIconPipe} from "../../../../pipe/state-icon.pipe";
import {StateColorClassPipe} from "../../../../pipe/state-color-class.pipe";
import {SidenavToggleComponent} from "../../../sidenav-toggle.component";

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
