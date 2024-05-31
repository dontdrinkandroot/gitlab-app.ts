import {Component} from "@angular/core";
import {AsyncPipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {combineLatest, filter, interval, Observable, startWith} from "rxjs";
import {ApiService} from "../api/api.service";
import {isNonNull} from "../rxjs/extensions";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {StateIconPipe} from "./state-icon.pipe";
import {StateColorClassPipe} from "./state-color-class.pipe";
import {Job} from "../job/job";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {InstanceContext} from "../instance/instance-context.service";
import {InstanceConfig} from "../instance/instance-config";
import {ProjectContext} from "../project/project-context.service";

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

    public project$ = this.projectContext.watchProject().pipe(filter(isNonNull));

    public pipelineId$: Observable<number> = this.route.params.pipe(map(params => +params['pipelineId']));

    public jobs$;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly projectContext: ProjectContext,
        private readonly api: ApiService,
        private readonly instanceContext: InstanceContext
    ) {
        this.jobs$ = combineLatest([
            this.project$,
            this.pipelineId$,
            interval(10000).pipe(startWith(0))
        ]).pipe(
            switchMap(([project, pipelineId]) => api.instance(project.instance).projects.get(project.id).pipelines.get(pipelineId).jobs()),
            map(jobs => jobs.sort((a, b) => a.id - b.id))
        );
    }

    public playJob(instance: InstanceConfig, job: Job) {
        this.api.instance(instance).projects.get(job.pipeline.project_id).jobs().get(job.id).play().subscribe();
    }

    public retryJob(instance: InstanceConfig, job: Job) {
        this.api.instance(instance).projects.get(job.pipeline.project_id).jobs().get(job.id).retry().subscribe();
    }

    public cancelJob(instance: InstanceConfig, job: Job) {
        this.api.instance(instance).projects.get(job.pipeline.project_id).jobs().get(job.id).cancel().subscribe();
    }
}
