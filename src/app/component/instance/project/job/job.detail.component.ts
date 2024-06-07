import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {combineLatest, filter, tap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../../../sidenav-toggle.component";
import {isNonNull} from "../../../../rxjs-extensions";
import {ProjectContext} from "../../../../service/project-context.service";
import {ApiService} from "../../../../service/api/api.service";

@Component({
    standalone: true,
    templateUrl: './job.detail.component.html',
    imports: [
        AsyncPipe,
        MatToolbar,
        SidenavToggleComponent
    ]
})
export class JobDetailComponent {

    public project$ = this.projectContext.watchProject().pipe(filter(isNonNull));

    public jobId$ = this.route.params.pipe(
        map((params) => +params['jobId']!),
    );

    public trace$ = combineLatest([this.project$, this.jobId$]).pipe(
        switchMap(([project, jobId]) => this.apiService.instance(project.instance).projects.get(project.id).jobs().get(jobId).trace()),
        tap((trace) => console.log(trace)),
    );

    constructor(
        private readonly projectContext: ProjectContext,
        private readonly apiService: ApiService,
        private readonly route: ActivatedRoute
    ) {
    }
}
