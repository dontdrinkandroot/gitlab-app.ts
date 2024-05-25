import {Component} from "@angular/core";
import {ProjectService} from "../project/project.service";
import {ApiService} from "../api/api.service";
import {ActivatedRoute} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {combineLatest, filter, tap} from "rxjs";
import {isNonNull} from "../rxjs/extensions";
import {AsyncPipe} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";

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

    public project$ = this.projectService.watchCurrentProject().pipe(filter(isNonNull));

    public jobId$ = this.route.params.pipe(
        map((params) => +params['jobId']!),
    );

    public trace$ = combineLatest([this.project$, this.jobId$]).pipe(
        switchMap(([project, jobId]) => this.apiService.projects.get(project.id).jobs().get(jobId).trace()),
        tap((trace) => console.log(trace)),
    );

    constructor(
        private readonly projectService: ProjectService,
        private readonly apiService: ApiService,
        private readonly route: ActivatedRoute
    ) {
    }
}
