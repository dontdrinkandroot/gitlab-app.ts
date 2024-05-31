import {Component} from "@angular/core";
import {AsyncPipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {combineLatest, filter, interval, Observable, startWith} from "rxjs";
import {ApiService} from "../api/api.service";
import {ProjectService} from "../project/project.service";
import {isNonNull} from "../rxjs/extensions";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {StateIconPipe} from "./state-icon.pipe";
import {StateColorClassPipe} from "./state-color-class.pipe";
import {Job} from "../job/job";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {InstanceContext} from "../instance/instance-context.service";

@Component({
    standalone: true,
    templateUrl: './pipeline.detail.component.html',
    imports: [
        AsyncPipe,
        MatToolbarModule,
        SidenavToggleComponent,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        NgClass,
        StateIconPipe,
        StateColorClassPipe,
        MatProgressSpinner,
        RouterLink,
    ]
})
export class PipelineDetailComponent {

    public instance$ = this.instanceContext.watchInstance().pipe(filter(isNonNull))

    public project$;

    public pipelineId$: Observable<number>;

    public jobs$;

    constructor(
        route: ActivatedRoute,
        projectService: ProjectService,
        private readonly api: ApiService,
        private readonly instanceContext: InstanceContext
    ) {
        this.pipelineId$ = route.params.pipe(map(params => +params['pipelineId']));
        this.project$ = projectService.watchCurrentProject().pipe(filter(isNonNull));
        this.jobs$ = combineLatest([
            this.project$,
            this.pipelineId$,
            interval(10000).pipe(startWith(0))
        ]).pipe(
            switchMap(([project, pipelineId]) => api.projects.get(project.id).pipelines().get(pipelineId).jobs()),
            map(jobs => jobs.sort((a, b) => a.id - b.id))
        );
    }

    public playJob(job: Job) {
        this.api.projects.get(job.pipeline.project_id).jobs().get(job.id).play().subscribe();
    }

    public retryJob(job: Job) {
        this.api.projects.get(job.pipeline.project_id).jobs().get(job.id).retry().subscribe();
    }

    public cancelJob(job: Job) {
        this.api.projects.get(job.pipeline.project_id).jobs().get(job.id).cancel().subscribe();
    }
}
